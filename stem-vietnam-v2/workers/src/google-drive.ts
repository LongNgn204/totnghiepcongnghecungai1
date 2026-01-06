// Chú thích: Google Drive API client cho Cloudflare Workers
// Sử dụng Service Account credentials để truy cập files

import { getAccessToken, type VertexAICredentials } from './gcp-auth';

// Chú thích: Interface cho file từ Google Drive
export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    createdTime?: string;
    modifiedTime?: string;
    webViewLink?: string;
}

// Chú thích: Interface cho folder metadata
export interface DriveFolder {
    id: string;
    name: string;
    files: DriveFile[];
}

// Chú thích: List tất cả files trong một folder
export async function listFilesInFolder(
    credentials: VertexAICredentials,
    folderId: string,
    mimeType?: string
): Promise<DriveFile[]> {
    const accessToken = await getAccessToken(credentials);

    // Chú thích: Build query - chỉ lấy files trong folder, không bị xóa
    let query = `'${folderId}' in parents and trashed = false`;
    if (mimeType) {
        query += ` and mimeType = '${mimeType}'`;
    }

    const params = new URLSearchParams({
        q: query,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
        pageSize: '100',
    });

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google Drive API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as { files: DriveFile[] };

    console.log('[google-drive] listed files', {
        folderId,
        count: data.files.length,
    });

    return data.files;
}

// Chú thích: List chỉ PDF files
export async function listPDFsInFolder(
    credentials: VertexAICredentials,
    folderId: string
): Promise<DriveFile[]> {
    return listFilesInFolder(credentials, folderId, 'application/pdf');
}

// Chú thích: Download file content dưới dạng ArrayBuffer
export async function downloadFile(
    credentials: VertexAICredentials,
    fileId: string
): Promise<ArrayBuffer> {
    const accessToken = await getAccessToken(credentials);

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google Drive download error: ${response.status} - ${error}`);
    }

    const buffer = await response.arrayBuffer();

    console.log('[google-drive] downloaded file', {
        fileId,
        sizeBytes: buffer.byteLength,
    });

    return buffer;
}

// Chú thích: Get file metadata
export async function getFileMetadata(
    credentials: VertexAICredentials,
    fileId: string
): Promise<DriveFile> {
    const accessToken = await getAccessToken(credentials);

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google Drive metadata error: ${response.status} - ${error}`);
    }

    return await response.json() as DriveFile;
}

// Chú thích: List subfolders trong một folder
export async function listSubfolders(
    credentials: VertexAICredentials,
    folderId: string
): Promise<DriveFile[]> {
    return listFilesInFolder(
        credentials,
        folderId,
        'application/vnd.google-apps.folder'
    );
}

// Chú thích: Recursive list tất cả PDFs trong folder và subfolders
export async function listAllPDFsRecursive(
    credentials: VertexAICredentials,
    folderId: string,
    parentPath: string = ''
): Promise<Array<DriveFile & { path: string }>> {
    const results: Array<DriveFile & { path: string }> = [];

    // Chú thích: Lấy PDFs trong folder hiện tại
    const pdfs = await listPDFsInFolder(credentials, folderId);
    for (const pdf of pdfs) {
        results.push({
            ...pdf,
            path: parentPath ? `${parentPath}/${pdf.name}` : pdf.name,
        });
    }

    // Chú thích: Đệ quy vào subfolders
    const subfolders = await listSubfolders(credentials, folderId);
    for (const folder of subfolders) {
        const subPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
        const subPdfs = await listAllPDFsRecursive(credentials, folder.id, subPath);
        results.push(...subPdfs);
    }

    return results;
}
