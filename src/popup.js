import "./popup.css";

const cheatMenuUrl = {
	get: async () => (await chrome.storage.sync.get("cheat-menu-url"))["cheat-menu-url"],
	set: url => chrome.storage.sync.set({
		"cheat-menu-url": url
	})
};

const gameFileUrl = {
	get: async () => (await chrome.storage.sync.get("game-file-url"))["game-file-url"],
	set: url => chrome.storage.sync.set({
		"game-file-url": url
	})
};

document.addEventListener("DOMContentLoaded", async () => {
	/**
	 * @type {HTMLInputElement}
	 */
	const cheatMenuInput = document.querySelector("#cheat-menu-url");
	/**
	 * @type {HTMLInputElement}
	 */
	const gameFileInput = document.querySelector("#game-file-url");
	/**
	 * @type {HTMLButtonElement}
	 */
	const button = document.querySelector("#save-button");

	let cheatMenuURL = await cheatMenuUrl.get();
	let gameFileURL = await gameFileUrl.get();

	if (!cheatMenuURL) {
		await cheatMenuUrl.set("https://raw.githubusercontent.com/ProdigyAPI/ProdigyX/70be96850d143ac5a60593717e22e604f1dd85e7/dist/extension-bundle.js");
		cheatMenuURL = await cheatMenuUrl.get();
	}

	if (!gameFileURL) {
		await gameFileUrl.set("https://raw.githubusercontent.com/ProdigyAPI/ProdigyGameFilePatchGenerator/master/game-files/current.js");
		gameFileURL = await gameFileUrl.get();
	}

	cheatMenuInput.value = cheatMenuURL;
	gameFileInput.value = gameFileURL;

	button.addEventListener("click", async () => {
		const validUrl = cheatMenuInput.validity.valid && gameFileInput.validity.valid;
		const cheatMenuURL = cheatMenuInput.value;
		const gameFileURL = gameFileInput.value;
		validUrl && await cheatMenuUrl.set(cheatMenuURL);
		validUrl && await gameFileUrl.set(gameFileURL);
		const oldText = button.innerText;
		button.innerText = validUrl ? "Saved!" : "Invalid URL";
		setTimeout(() => {
			button.innerText = oldText;
		}, 1000);
	});
});
