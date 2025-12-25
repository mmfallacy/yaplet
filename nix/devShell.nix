{
  pkgs,
  extras,
}:
with pkgs;
mkShell {
  name = "yaplet development shell";

  nativeBuildInputs = [
    extras.pkgs-unstable.bun
    vtsls
  ];

}
