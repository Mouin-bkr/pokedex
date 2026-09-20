# Regenerate the README demo GIF:  vhs docs/demo.tape
# Needs: vhs (https://github.com/charmbracelet/vhs), plus its deps ttyd and ffmpeg.
# Run from the repo root. Uses a throwaway save file, so your real pokedex is untouched.
# Each command waits for the next "Pokedex >" prompt, so timing follows the network.

Output "docs/demo.gif"

Require node

Set Shell "bash"
Set FontSize 16
Set Width 1100
Set Height 700
Set Padding 20
Set TypingSpeed 55ms
Set Theme "Catppuccin Mocha"
Set WaitTimeout 30s

Env POKEDEX_FILE "/tmp/pokedex-demo.json"

Hide
Type "rm -f $POKEDEX_FILE && npm run build --silent && clear" Enter
Show

Type "node dist/main.js" Enter
Wait /Pokedex >\s*$/
Sleep 800ms

Type "encounter pastoria-city-area" Enter
Wait /Pokedex >\s*$/
Sleep 1500ms
Type "throw masterball" Enter
Wait /Pokedex >\s*$/
Sleep 1500ms

Type "catch pikachu masterball" Enter
Wait /Pokedex >\s*$/
Sleep 1s
Type "catch charizard masterball" Enter
Wait /Pokedex >\s*$/
Sleep 1s

Type "pokedex" Enter
Wait /Pokedex >\s*$/
Sleep 1500ms

Type "battle pikachu charizard" Enter
Wait /Pokedex >\s*$/
Sleep 2500ms

Type "exit" Enter
Sleep 800ms

Type "clear" Enter
Type "node dist/main.js" Enter
Wait /Pokedex >\s*$/
Sleep 800ms
Type "pokedex" Enter
Wait /Pokedex >\s*$/
Sleep 2500ms
Type "exit" Enter
Sleep 1s
