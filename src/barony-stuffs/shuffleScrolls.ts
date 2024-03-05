import { BaronyRNG } from "./BaronyRNG";

/**
 * https://github.com/TurningWheel/Barony/blob/51e7b8015ff2bc68654826076b5bf571e1d75534/src/scores.cpp#L2923
 */
export function shuffleScrolls(rng: BaronyRNG, list: string[]) {
    const enchantedFeatherScrollsShuffled: (typeof list)[number][] = [];
    const shuffle = [...list];

    while (shuffle.length > 0) {
        const index = rng.getU8() % shuffle.length;
        enchantedFeatherScrollsShuffled.push(shuffle[index]);
        shuffle.splice(index, 1);
    }

    return enchantedFeatherScrollsShuffled;
}
