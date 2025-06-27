export type createArticleData = {
    _id: string,
    url: string,
    image: [{
        url: string
    }],
    creator: string,
    title: string | undefined,
    subtitle: string | undefined,
    flatform: string,
    user: string,
    tag: string[]
}

export type articleData = {
    url: string,
    creator: string,
    image: [{
        url: string
    }],
    title: string,
    subtitle: string,
    _id: string,
    flatform: string,
    tag: [string]
}

export type tagData = [{
    userid: string,
    color: string,
    tagname : string
}]