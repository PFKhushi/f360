# contar-linhas.ps1

param (
    [string]$Autor = "$(git config user.name)"
)

$added = 0
$removed = 0

git log --author="$Autor" --pretty=tformat: --numstat | ForEach-Object {
    if ($_ -match '^\d+') {
        $fields = $_ -split "`t"
        $added += [int]$fields[0]
        $removed += [int]$fields[1]
    }
}

Write-Host "Usuário: $Autor"
Write-Host "Linhas adicionadas: $added"
Write-Host "Linhas removidas:   $removed"
Write-Host "Total modificadas:  " ($added + $removed)