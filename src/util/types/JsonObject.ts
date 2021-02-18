import Json from './Json';

export default interface JsonObject {
    [key: string]: string | number | Json;
    $: string | number | Json;
}
