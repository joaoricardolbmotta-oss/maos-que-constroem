/**
 * Google Drive Integration
 * Fase 31: Google Drive Storage
 */

import { google } from 'googleapis';

export async function initGoogleDrive(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.drive({ version: 'v3', auth });
}

export async function uploadReportToDrive(
  accessToken: string,
  fileName: string,
  fileContent: Buffer,
  folderId?: string
) {
  try {
    const drive = await initGoogleDrive(accessToken);

    const file = await drive.files.create(
      {
        requestBody: {
          name: fileName,
          mimeType: 'application/pdf',
          parents: folderId ? [folderId] : undefined,
        },
        media: {
          mimeType: 'application/pdf',
          body: fileContent,
        },
      },
      { maxContentLength: Infinity }
    );

    return {
      fileId: file.data.id,
      webViewLink: file.data.webViewLink,
    };
  } catch (error) {
    console.error('Drive upload error:', error);
    throw error;
  }
}

export async function createDriveFolder(accessToken: string, folderName: string) {
  try {
    const drive = await initGoogleDrive(accessToken);

    const folder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
    });

    return folder.data.id;
  } catch (error) {
    console.error('Drive folder creation error:', error);
    throw error;
  }
}

export async function listDriveFiles(accessToken: string, folderId?: string) {
  try {
    const drive = await initGoogleDrive(accessToken);

    const query = folderId ? `'${folderId}' in parents and trashed=false` : "trashed=false";

    const files = await drive.files.list({
      q: query,
      spaces: 'drive',
      fields: 'files(id, name, mimeType, createdTime, webViewLink)',
      pageSize: 100,
    });

    return files.data.files || [];
  } catch (error) {
    console.error('Drive list error:', error);
    throw error;
  }
}

export async function shareDriveFile(
  accessToken: string,
  fileId: string,
  email: string,
  role: 'viewer' | 'commenter' | 'editor' = 'viewer'
) {
  try {
    const drive = await initGoogleDrive(accessToken);

    await drive.permissions.create({
      fileId,
      requestBody: {
        role,
        type: 'user',
        emailAddress: email,
      },
    });

    return true;
  } catch (error) {
    console.error('Drive share error:', error);
    throw error;
  }
}

export async function deleteDriveFile(accessToken: string, fileId: string) {
  try {
    const drive = await initGoogleDrive(accessToken);
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('Drive delete error:', error);
    throw error;
  }
}
