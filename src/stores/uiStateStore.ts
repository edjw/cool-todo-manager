import { atom, action } from "nanostores";

export const $isMenuOpen = atom(false);

export const toggleMenu = action($isMenuOpen, "toggleMenu", (store) => {
	if (store.get() === true) {
		store.set(false);
	}
	else {
		store.set(true);
	}
});
