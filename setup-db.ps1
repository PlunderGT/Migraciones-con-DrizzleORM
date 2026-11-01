# Crea e inicia una base PostgreSQL propia (puerto 5433), sin admin y sin tocar tu instalación.
$ErrorActionPreference = "Stop"
$bin  = "C:\Program Files\PostgreSQL\17\bin"
$data = Join-Path $env:LOCALAPPDATA "biblioteca-pgdata"
$pw   = "biblioteca123"
$port = 5433

if (-not (Test-Path (Join-Path $data "PG_VERSION"))) {
  $pwfile = Join-Path $env:TEMP "pgpw.txt"
  [System.IO.File]::WriteAllText($pwfile, $pw)
  & "$bin\initdb.exe" -D $data -U postgres -A scram-sha-256 --pwfile=$pwfile --locale=C -E UTF8
  Remove-Item $pwfile -Force
}

& "$bin\pg_ctl.exe" -D $data -o "-p $port" -l (Join-Path $env:TEMP "biblioteca-pg.log") -w start

$env:PGPASSWORD = $pw
$ErrorActionPreference = "Continue"
& "$bin\createdb.exe" -h localhost -p $port -U postgres biblioteca 2>$null
$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".env"
$content = "DATABASE_URL=postgresql://postgres:$pw@localhost:$port/biblioteca`nPORT=3000`n"
[System.IO.File]::WriteAllText($envFile, $content)

Write-Host "Listo. Base 'biblioteca' en el puerto $port y .env creado."
