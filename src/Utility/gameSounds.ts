export function playGameSound(path: string) {
    let audio = new Audio(path)
    if (localStorage.getItem("mute-sounds") != "true")
        audio.play()
}