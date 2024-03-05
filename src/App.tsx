import { useState } from "react";
import { BaronyRNG } from "./barony-stuffs/BaronyRNG";
import { shuffleScrolls } from "./barony-stuffs/shuffleScrolls";
import {
    enchantedFeatherScrollsFixedList,
    scrollLabels,
} from "./barony-stuffs/constants";

const enchantedFeatherScrollsFixedListHumanReadable =
    enchantedFeatherScrollsFixedList.map((scroll) =>
        scroll.replace("SCROLL_", ""),
    );

function Form({ handleSubmit }: { handleSubmit: (gamekey: string) => void }) {
    return (
        <form
            className="flex max-w-md items-center gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                const { value: gamekey } = e.currentTarget.elements.namedItem(
                    "gamekey",
                ) as HTMLInputElement;
                if (!gamekey) {
                    throw new Error("gamekey is required");
                }
                handleSubmit(gamekey);
            }}
        >
            <label className="flex items-center gap-2">
                Gamekey
                <input
                    className="rounded "
                    required
                    id="gamekey"
                    type="text"
                    placeholder="123456789"
                ></input>
            </label>
            <button
                className="rounded bg-sky-600 p-2 px-4 text-white ring-1 ring-gray-900/5"
                type="submit"
            >
                Calc
            </button>
        </form>
    );
}

function App() {
    const [scrollNames, setScrollNames] = useState<string[]>([]);

    function calc(gamekey: string) {
        const rng = new BaronyRNG();
        const gamekeyNumber = Number(gamekey);
        if (isNaN(gamekeyNumber)) {
            throw new Error("gamekey is not a number");
        }
        rng.seedWithNumber(gamekeyNumber);
        const suffledScrolls = shuffleScrolls(
            rng,
            enchantedFeatherScrollsFixedListHumanReadable,
        );
        setScrollNames(suffledScrolls);
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-50  sm:py-12">
            <div className="relative flex flex-col gap-4 bg-white p-6 shadow-md ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                <h1 className="text-2xl font-bold">Barony Scroll Identifier</h1>
                <p>
                    This tool calculates the match between scroll labels and
                    their effects based on the gamekey from the save data.
                </p>
                <details>
                    <summary className="m-2">
                        What is Gamekey? How Do I Find It?
                    </summary>
                    <p>
                        The gamekey is a number located near the start of the
                        save file. To find it, open the <code>baronysave</code>{" "}
                        file found in the{" "}
                        <code>&lt;barony installed location&gt;/savegames</code>{" "}
                        directory using a text editor.
                    </p>
                    <img src="img/gamekey.png" />
                </details>

                <Form handleSubmit={calc} />

                <ol className="flex flex-col gap-1">
                    {scrollNames.map((scroll, index) => (
                        <div className="flex items-center" key={index}>
                            <span className="notranslate">
                                {scrollLabels[index]}
                            </span>
                            <span className="flex-1">
                                <hr className="relative mx-2 h-px border border-dashed" />
                            </span>
                            <span>{scroll}</span>
                        </div>
                    ))}
                </ol>

                <footer className="flex justify-between gap-4">
                    <span>
                        Made by <a href="https://mizle.net">Eai</a>.
                    </span>
                    <span>
                        Code hosted on{" "}
                        <a href="https://github.com/eai04191/barony-scroll-identifier">
                            GitHub
                        </a>
                        .
                    </span>
                </footer>
            </div>
        </div>
    );
}

export default App;
