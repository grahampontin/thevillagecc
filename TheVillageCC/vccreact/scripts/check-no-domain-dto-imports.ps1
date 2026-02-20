param(
  [string]$Root = "src"
)

$patterns = @(
  "from\s+['\"]\.\./domain/",
  "from\s+['\"]\./domain/",
  "../domain/",
  "./domain/"
)

$files = Get-ChildItem -Recurse -Path $Root -Include *.ts,*.tsx
$hits = @()

foreach ($file in $files) {
  $content = Get-Content -Raw -Path $file.FullName
  foreach ($p in $patterns) {
    if ($content -match $p) {
      $hits += "$($file.FullName) matched pattern: $p"
      break
    }
  }
}

if ($hits.Count -gt 0) {
  Write-Host "Found forbidden domain DTO imports:" -ForegroundColor Red
  $hits | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "OK: no domain DTO imports found in $Root" -ForegroundColor Green
