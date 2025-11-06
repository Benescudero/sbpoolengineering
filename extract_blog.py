from pathlib import Path
patch_path = Path('ga-analytics.patch')
print('Reading patch from', patch_path.resolve())
if not patch_path.exists():
    raise SystemExit('patch file missing')
target_files = {
    'blog/index.html',
    'blog/how-to-clean-salt-cell.html',
    'blog/signs-salt-cell-failing.html',
    'blog/how-long-do-salt-cells-last.html',
    'blog/texas-salt-cell-maintenance.html',
    'blog/why-salt-cell-not-producing-chlorine.html',
    'blog/florida-pool-owners-protect-salt-cell.html',
    'blog/top-7-mistakes-kill-salt-cells.html',
    'blog/salt-cell-replacement-cost.html',
}
contents = {tf: [] for tf in target_files}
current = None
old_path = None
with patch_path.open('r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if line.startswith('diff --git'):
            current = None
            continue
        if line.startswith('--- '):
            old_path = line.split()[1]
            continue
        if line.startswith('+++ '):
            new_path = line.split()[1]
            if new_path.startswith('b/'):
                new_path = new_path[2:]
            if old_path == '/dev/null' and new_path in target_files:
                current = new_path
            else:
                current = None
            continue
        if current is None:
            continue
        if line.startswith('+') and not line.startswith('+++'):
            contents[current].append(line[1:])
        elif line.startswith('\\'):
            continue
missing = [k for k,v in contents.items() if not v]
print('Missing slots:', missing)
if missing:
    raise SystemExit('missing content')
for path, lines in contents.items():
    out_path = Path(path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(''.join(lines), encoding='utf-8')
    print('Wrote', path, len(lines), 'lines')
