export type CategoryId =
    | 'nature'
    | 'water'
    | 'weather'
    | 'fire'
    | 'urban'
    | 'indoor'
    | 'travel'
    | 'animals'
    | 'noise'
    | 'meditation'

export interface Category {
    id: CategoryId
    name: string
    icon: string
}

export interface SoundEntry {
    id: number
    name: string
    path: string
    icon: string
    bgColor: string
    iconColor: string
    autoPlay: boolean
    loop: boolean
    category: CategoryId
}
