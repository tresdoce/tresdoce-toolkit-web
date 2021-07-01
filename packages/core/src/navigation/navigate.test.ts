import { Navigation } from "..";
import { normalized, normalizeUrl } from "./navigate";

describe('Navigation test', () => {
    describe('Navigation normalized test', () => {
        test('Navigation normalized should be true', () => {
            Navigation.setNormalized(true)
            expect(normalized).toStrictEqual(true);
        });
        test('Navigation normalized should be false', () => {
            Navigation.setNormalized(false)
            expect(normalized).toStrictEqual(false);
        });
        test('normalize url',() => {
            expect(normalizeUrl('https://Pingüino:Málaga.ciudad fantástica.en/Logroño/me/pica/el.../oño')).toStrictEqual('https://pinguino:malaga.ciudad-fantastica.en/logrono/me/pica/el.../ono')
        })
    });
});
