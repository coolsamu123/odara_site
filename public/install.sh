#!/bin/sh
# Odara CLI installer for Linux (macOS coming soon)
#
#   curl -fsSL https://odara.rs/install.sh | sh
#
# Env vars (optional):
#   ODARA_VERSION       Specific version (default: latest from odara.rs/version.txt)
#   ODARA_INSTALL_DIR   Install location (default: ~/.local/share/odara)
#   ODARA_BIN_DIR       Shim location (default: ~/.local/bin)
#   ODARA_RUN           "1" to launch Odara immediately after install
#   ODARA_NO_PATH       "1" to skip auto-editing your shell rc PATH
#   ODARA_NO_LAUNCHER   "1" to skip creating the desktop launcher

set -e

# === Helpers ===
say() { printf "\033[36m==> %s\033[0m\n" "$1"; }
ok()  { printf "\033[32m    %s\033[0m\n" "$1"; }
err() { printf "\033[31mERROR: %s\033[0m\n" "$1" >&2; }

# === OS / arch detect ===
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux)
        PLATFORM="linux"
        ;;
    Darwin)
        err "macOS support is coming soon."
        err "Track progress at https://github.com/coolsamu123/odara_community"
        exit 1
        ;;
    MINGW*|MSYS*|CYGWIN*)
        err "You're on Windows. Use the PowerShell installer instead:"
        err "    irm https://odara.rs/install.ps1 | iex"
        exit 1
        ;;
    *)
        err "Unsupported OS: $OS"
        exit 1
        ;;
esac

case "$ARCH" in
    x86_64|amd64)
        ARCH_TAG="amd64"
        ;;
    aarch64|arm64)
        err "ARM64 support is coming soon."
        err "Track progress at https://github.com/coolsamu123/odara_community"
        exit 1
        ;;
    *)
        err "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# === curl required ===
if ! command -v curl >/dev/null 2>&1; then
    err "curl is required but not installed."
    err "  Debian/Ubuntu:  sudo apt install curl"
    err "  Fedora/RHEL:    sudo dnf install curl"
    exit 1
fi

# === Resolve version ===
VERSION="${ODARA_VERSION:-}"
if [ -z "$VERSION" ]; then
    say "Resolving latest version..."
    VERSION="$(curl -fsSL https://odara.rs/version.txt | tr -d ' \t\r\n')"
    if [ -z "$VERSION" ]; then
        err "Could not fetch version from https://odara.rs/version.txt"
        err "Workaround: ODARA_VERSION=X.Y.Z curl -fsSL https://odara.rs/install.sh | sh"
        exit 1
    fi
fi
ok "Version: $VERSION"

INSTALL_DIR="${ODARA_INSTALL_DIR:-$HOME/.local/share/odara}"
BIN_DIR="${ODARA_BIN_DIR:-$HOME/.local/bin}"
ok "Install dir: $INSTALL_DIR"

# === Download ===
BASE_URL="https://pub-8227a3dbc0c64f88b0bbc027d1108f55.r2.dev/$PLATFORM"
ARCHIVE="odara_${VERSION}_${PLATFORM}_${ARCH_TAG}.tar.gz"
URL="$BASE_URL/$ARCHIVE"

TMP="$(mktemp -d -t odara-install.XXXXXX)"
trap "rm -rf '$TMP'" EXIT

say "Downloading $ARCHIVE (~120 MB, please wait)..."
if ! curl -fsSL "$URL" -o "$TMP/$ARCHIVE"; then
    err "Download failed: $URL"
    err "Check your internet connection or try ODARA_VERSION=0.1.0"
    exit 1
fi
ok "Download complete."

# === Verify SHA256 ===
say "Verifying SHA256..."
if ! curl -fsSL "$URL.sha256" -o "$TMP/$ARCHIVE.sha256"; then
    err "Could not fetch .sha256 sidecar from $URL.sha256"
    err "Refusing to install unverified package."
    exit 1
fi

EXPECTED="$(awk '{print $1}' "$TMP/$ARCHIVE.sha256" | tr 'A-Z' 'a-z')"
if command -v sha256sum >/dev/null 2>&1; then
    ACTUAL="$(sha256sum "$TMP/$ARCHIVE" | awk '{print $1}' | tr 'A-Z' 'a-z')"
elif command -v shasum >/dev/null 2>&1; then
    ACTUAL="$(shasum -a 256 "$TMP/$ARCHIVE" | awk '{print $1}' | tr 'A-Z' 'a-z')"
else
    err "Neither sha256sum nor shasum is available."
    exit 1
fi

if [ "$EXPECTED" != "$ACTUAL" ]; then
    err "SHA256 mismatch."
    err "  expected: $EXPECTED"
    err "  actual:   $ACTUAL"
    err "Refusing to install a tampered package."
    exit 1
fi
ok "Hash verified."

# === Preserve existing data/ (SQLite DB) across reinstalls ===
if [ -d "$INSTALL_DIR/data" ] && [ -n "$(ls -A "$INSTALL_DIR/data" 2>/dev/null)" ]; then
    say "Preserving existing data/..."
    mv "$INSTALL_DIR/data" "$TMP/data-backup"
    ok "Backed up."
fi

# === Extract ===
say "Extracting to $INSTALL_DIR..."
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
# Tarball internal root is "odara/" — strip it so files land directly in INSTALL_DIR.
tar -xzf "$TMP/$ARCHIVE" -C "$INSTALL_DIR" --strip-components=1
ok "Extracted."

# === Restore data ===
if [ -d "$TMP/data-backup" ]; then
    say "Restoring data/..."
    rm -rf "$INSTALL_DIR/data"
    mv "$TMP/data-backup" "$INSTALL_DIR/data"
    ok "Restored."
fi

# === Shim in user PATH ===
# Direct wrapper (no symlink) so the script knows the install dir even if
# called from a path that resolves symlinks weirdly. The tarball's own
# bin/odara is a .deb/systemd wrapper and isn't usable for user-scope installs.
say "Creating shim at $BIN_DIR/odara..."
mkdir -p "$BIN_DIR"
cat > "$BIN_DIR/odara" <<EOF
#!/bin/sh
exec "$INSTALL_DIR/start.sh" "\$@"
EOF
chmod +x "$BIN_DIR/odara"
ok "Shim created."

# === Ensure BIN_DIR is on PATH (edit shell rc automatically) ===
# Already active in this session? Nothing to do.
path_active=0
case ":$PATH:" in
    *":$BIN_DIR:"*) path_active=1 ;;
esac

if [ "$path_active" -eq 1 ]; then
    ok "$BIN_DIR already on PATH."
elif [ "${ODARA_NO_PATH:-}" = "1" ]; then
    printf "\n\033[33m  %s is not on your PATH and ODARA_NO_PATH=1 was set.\033[0m\n" "$BIN_DIR"
    printf "  Add manually: \033[36mexport PATH=\"%s:\$PATH\"\033[0m\n" "$BIN_DIR"
else
    say "Adding $BIN_DIR to your PATH..."
    # Pick the rc file for the user's login shell.
    shell_name="$(basename "${SHELL:-/bin/sh}")"
    case "$shell_name" in
        zsh)  RC="$HOME/.zshrc" ;;
        bash) RC="$HOME/.bashrc" ;;
        *)    RC="$HOME/.profile" ;;
    esac
    PATH_LINE="export PATH=\"$BIN_DIR:\$PATH\""
    # Idempotent: only append if not already present.
    if [ -f "$RC" ] && grep -qF "$PATH_LINE" "$RC" 2>/dev/null; then
        ok "PATH already configured in $RC"
    else
        printf '\n# Added by Odara installer\n%s\n' "$PATH_LINE" >> "$RC"
        ok "Updated $RC"
    fi
    # Make it work in THIS shell too (the piped installer is a subshell, but
    # if the user sources install.sh directly this takes effect immediately).
    export PATH="$BIN_DIR:$PATH"
    PATH_RC="$RC"
fi

# === Desktop launcher (double-click, with icon) ===
# Harmless on headless servers; only visible where a desktop environment runs.
if [ "${ODARA_NO_LAUNCHER:-}" != "1" ]; then
    say "Creating desktop launcher..."
    APPS_DIR="$HOME/.local/share/applications"
    ICON_DIR="$HOME/.local/share/icons"
    mkdir -p "$APPS_DIR" "$ICON_DIR"

    # Locate an icon shipped inside the tarball; fall back to a themed name.
    ICON_VALUE="utilities-terminal"
    for cand in \
        "$INSTALL_DIR/assets/icons/odara.png" \
        "$INSTALL_DIR/assets/odara.png" \
        "$INSTALL_DIR/icons/odara.png" \
        "$INSTALL_DIR/icon.png" \
        "$INSTALL_DIR/odara.png"; do
        if [ -f "$cand" ]; then
            cp "$cand" "$ICON_DIR/odara.png"
            ICON_VALUE="$ICON_DIR/odara.png"
            break
        fi
    done

    DESKTOP_FILE="$APPS_DIR/odara.desktop"
    cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Name=Odara
Comment=AI-First ETL/ELT Platform
Exec=sh -c "$BIN_DIR/odara & sleep 2 && (command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:3002 || true)"
Icon=$ICON_VALUE
Terminal=true
Type=Application
Categories=Development;Database;
Keywords=ETL;ELT;Data;Pipeline;
StartupNotify=true
EOF
    chmod +x "$DESKTOP_FILE"
    ok "App menu entry: $DESKTOP_FILE"

    # Also drop a clickable copy on the Desktop, if one exists.
    if [ -d "$HOME/Desktop" ]; then
        cp "$DESKTOP_FILE" "$HOME/Desktop/Odara.desktop"
        chmod +x "$HOME/Desktop/Odara.desktop"
        # GNOME marks unknown .desktop files "Untrusted" until allow-listed.
        if command -v gio >/dev/null 2>&1; then
            gio set "$HOME/Desktop/Odara.desktop" metadata::trusted true 2>/dev/null || true
        fi
        ok "Desktop shortcut: $HOME/Desktop/Odara.desktop"
    fi

    # Refresh the menu database so it shows up without re-login.
    if command -v update-desktop-database >/dev/null 2>&1; then
        update-desktop-database "$APPS_DIR" 2>/dev/null || true
    fi
fi

# === Done ===
printf "\n\033[32m  Odara %s installed at %s\033[0m\n" "$VERSION" "$INSTALL_DIR"
if [ -n "${PATH_RC:-}" ]; then
    printf "\n  PATH was added to \033[37m%s\033[0m. To use 'odara' in THIS terminal now, run:\n" "$PATH_RC"
    printf "      \033[36msource %s\033[0m\n" "$PATH_RC"
    printf "  New terminals will pick it up automatically.\n"
else
    printf "\n  Run: \033[37modara\033[0m\n"
fi
printf "  Then visit: \033[33mhttp://localhost:3002\033[0m\n\n"

if [ "${ODARA_RUN:-}" = "1" ]; then
    say "Launching now..."
    "$INSTALL_DIR/start.sh" &
    sleep 2
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "http://localhost:3002" >/dev/null 2>&1 || true
    fi
fi
