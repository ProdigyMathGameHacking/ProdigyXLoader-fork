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

async function insertCode () {
	try {
		const request = await (await fetch(await gameFileUrl.get())).text();
		const cheatMenuRequest = await (await fetch(await cheatMenuUrl.get())).text();
		document.documentElement.setAttribute("onreset", `${request}\nSW.Load.decrementLoadSemaphore();\n${cheatMenuRequest.replaceAll("new URL", "new window.URL")}`);
		document.documentElement.dispatchEvent(new CustomEvent("reset"));
		document.documentElement.removeAttribute("onreset");
	} catch (e) {
		alert("Failed to load hack\n" + e.message);
	}
}

if (!window.scriptIsInjected) {
	window.scriptIsInjected = true;
	setTimeout(insertCode, 1000);
	console.group("integrity patches");
	[...document.getElementsByTagName("script"), ...document.getElementsByTagName("link")].forEach(v => {
		if (v.integrity) {
			console.log(v.integrity);
			v.removeAttribute("integrity");
		}
	});
	console.groupEnd();
}
