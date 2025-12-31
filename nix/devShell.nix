{
  pkgs,
  extras,
}:
with pkgs;
mkShell {
  name = "yaplet development shell";

  nativeBuildInputs =
    let
      bin = pkg: lib.getExe pkg;
      gen-webhook-secret = pkgs.writeShellScriptBin "gen-webhook-secret" ''
        ${bin pkgs.openssl} rand -base64 32
      '';
    in
    [
      extras.pkgs-unstable.bun
      nodejs_24
      vtsls
      vscode-langservers-extracted
      emmet-language-server
      tailwindcss-language-server
      svelte-language-server

      gen-webhook-secret
    ]
    ++ pkgs.lib.mapAttrsToList (k: v: pkgs.writeShellScriptBin k v) {
      pnpm = "corepack pnpm \$@";
      pnpx = "corepack pnpx \$@";
    };

}
