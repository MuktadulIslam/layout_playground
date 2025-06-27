export interface SketchfabModel {
    uid: string;
    name: string;
    description: string;
    thumbnails: {
        images: Array<{
            url: string;
            width: number;
            height: number;
        }>;
    };
    user: {
        displayName: string;
        username: string;
        avatar: {
            images: Array<{
                url: string;
            }>;
        };
    };
    viewCount?: number;
    likeCount?: number;
    downloadCount?: number;
    embedUrl: string;
    viewerUrl: string;
    tags: Array<{
        name: string;
    }>;
    createdAt: string;
    isDownloadable: boolean;
}

export interface SketchfabResponse {
    results: SketchfabModel[];
    next: string | null;
    previous: string | null;
    count: number;
}