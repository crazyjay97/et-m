import Dexie from 'dexie'


const DB_NAME = 'WeddingDatabase'

export default class WeddingDatabase extends Dexie {
    wedding: Dexie.Table<IWedding, number>;
    attachment: Dexie.Table<IAttachment, number>;

    constructor() {
        super(DB_NAME)
        this.version(2).stores({
            wedding: '++id,colorName,colorValue,desc,cost,price',
            attachment: '++id,weddingId,name,path',
        })

        this.wedding = this.table('wedding')
        this.attachment = this.table('attachment')
    }
}


export interface IWedding extends IPrice {
    id?: number
    colorName: string
    colorValue: string
    desc: string
}

export interface IAttachment {
    id?: number
    weddingId: number
    name: string
    path: string
}


interface IPrice {
    cost: number
    price: number
}
