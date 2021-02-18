import Json from './Json';

export default interface JsonArray {
    [key: number]: string | number | Json;
}
