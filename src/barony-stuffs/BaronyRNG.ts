/**
 * https://github.com/TurningWheel/Barony/blob/51e7b8015ff2bc68654826076b5bf571e1d75534/src/prng.cpp
 */
export class BaronyRNG {
    private buf: Uint8Array;
    private seed: Uint8Array;
    private seed_size: number;
    private i1: number;
    private i2: number;
    private bytes_read: number;
    private seeded: boolean;

    constructor() {
        this.buf = new Uint8Array(256);
        this.seed = new Uint8Array(256);
        this.seed_size = 0;
        this.i1 = 0;
        this.i2 = 0;
        this.bytes_read = 0;
        this.seeded = false;

        for (let i = 0; i < 256; ++i) {
            this.buf[i] = i;
        }
    }

    private swap_byte(a: number, b: number): void {
        const temp = this.buf[a];
        this.buf[a] = this.buf[b];
        this.buf[b] = temp;
    }

    public seedImpl(key: ArrayBuffer): void {
        const keyBytes = new Uint8Array(key);
        const size = key.byteLength;
        let b = 0;

        for (let i = 0; i < 256; ++i) {
            b = (b + this.buf[i] + keyBytes[i % size]) & 255;
            this.swap_byte(i, b);
        }

        this.seed.set(keyBytes.subarray(0, size));
        this.seed_size = size;
        this.i1 = this.i2 = 0;
        this.bytes_read = 0;
        this.seeded = true;
    }

    public seedWithNumber(key: number): void {
        // Convert the number into a 32-bit array (4 bytes)
        const buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0, key, true); // true for little-endian
        this.seedImpl(buffer);
    }

    public getU8(): number {
        const result = new Uint8Array(1);
        this.getBytes(result.buffer);
        return result[0];
    }

    public getBytes(data: ArrayBuffer): void {
        const dataBytes = new Uint8Array(data);
        const size = data.byteLength;

        if (!this.seeded) {
            console.error("RNG not seeded, seeding by current time");
            const t = new Uint32Array([Date.now()]); // we only want a 32-bit seed
            this.seedImpl(t.buffer);
        }

        for (let i = 0; i < size; ++i) {
            this.i1 = (this.i1 + 1) & 255;
            this.i2 = (this.i2 + this.buf[this.i1]) & 255;
            this.swap_byte(this.i1, this.i2);
            dataBytes[i] =
                this.buf[(this.buf[this.i1] + this.buf[this.i2]) & 255];
            this.bytes_read++;
        }
    }
}
