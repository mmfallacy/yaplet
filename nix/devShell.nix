{
  pkgs,
  extras,
}:
with pkgs;
mkShell {
  name = "yaplet development shell";

  nativeBuildInputs = [
    extras.pkgs-unstable.bun
    nodejs_24
    vtsls
    vscode-langservers-extracted
    emmet-language-server
    tailwindcss-language-server
    svelte-language-server
  ]
  ++ pkgs.lib.mapAttrsToList (k: v: pkgs.writeShellScriptBin k v) {
    pnpm = "corepack pnpm \$@";
    pnpx = "corepack pnpx \$@";
  };

}
