export const LoginMode = {
    SignIn: 'SIGNIN',
    SignUp: 'SIGNUP',
    ForgotPassword: 'FORGOTPASSWORD',
}

export const ROW_PER_PAGE_DEFAULT = 10;
export const ROW_PER_PAGE_DEFAULT_LIST = [5, 10, 20, 50, 100];

export const NUMBER_OF_EXCEL_INSERT_ROW = 100;

export const EMPTY_VALUE_STRING = '--';

export const DEFAULT_FORMAT_DATE = 'DD/MM/YYYY';
export const DEFAULT_FORMAT_DATETIME = 'DD/MM/YYYY HH:mm:ss';
export const DATE_HOUR_MINUTES_UPPER_MERIDIEM = 'DD/MM/YYYY hh:mm A';
export const DATE_HOUR_MINUTES_SECONDS_UPPER_MERIDIEM = 'DD/MM/YYYY hh:mm:ss A';
export const EDITOR_CONTENT_LIMIT = 3000;
export const ATTACHMENT_MAX_SIZE = 10000000;
export const DEFAULT_PROFILE_PIC_URL = "https://firebasestorage.googleapis.com/v0/b/crm-project-9b8c9.appspot.com/o/Default%2Fprofile.png?alt=media&token=3dda3486-803b-4241-8752-b57b8299ffb1";

export const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const URL_REGEX = new RegExp(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)(:[0-9]{1,5})?(\/[^\s]*)?$/);

export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 50;

export const TYPE_COLOR = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

export const STATS_NAME = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Spd'
};

export const VERSION_COLOR = {
    // Gen I
    "red": "#FF0000",
    "blue": "#0000FF",
    "yellow": "#FFD733",
    "green": "#00CC00", // JP only

    // Gen II
    "gold": "#DAA520",
    "silver": "#C0C0C0",
    "crystal": "#4FD9FF",

    // Gen III
    "ruby": "#E0115F",
    "sapphire": "#0A52BF",
    "emerald": "#50C878",
    "fire red": "#FF4500",
    "leaf green": "#32CD32",

    // Gen IV
    "diamond": "#B9F2FF",
    "pearl": "#E8E0F0",
    "platinum": "#CECECE",
    "heart gold": "#B8860B",
    "soul silver": "#B0C4DE",

    // Gen V
    "black": "#101820",
    "white": "#FFFFFF",
    "black 2": "#1C1C1C",
    "white 2": "#F5F5F5",

    // Gen VI
    "x": "#5DADEC",
    "y": "#FF69B4",
    "omega ruby": "#B22222",
    "alpha sapphire": "#4169E1",

    // Gen VII
    "sun": "#FFCC33",
    "moon": "#483D8B",
    "ultra sun": "#FFB347",
    "ultra moon": "#9370DB",

    // Gen VIII
    "sword": "#4169E1",
    "shield": "#DC143C",
    "brilliant diamond": "#ADD8E6",
    "shining pearl": "#F8C8DC",
    "legends arceus": "#708090",

    // Gen IX
    "scarlet": "#C41E3A",
    "violet": "#8F00FF",
}