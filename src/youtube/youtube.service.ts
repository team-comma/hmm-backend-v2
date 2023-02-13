import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class YoutubeService {
  private instance: AxiosInstance;
  constructor(private readonly authService: AuthService) {
    this.init();
  }

  private async init() {
    const accessToken = await this.authService.getGoogleAccesToken();
    this.instance = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public async createPlaylist(title: string) {
    try {
      const { data } = await this.instance.post(
        'playlists',
        {
          snippet: { title },
          status: {
            privacyStatus: 'private',
          },
        },
        {
          params: { part: 'snippet,status' },
        },
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPlaylist() {
    try {
      const { data } = await this.instance.get('playlists', {
        params: {
          part: 'snippet',
          mine: true,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getVideoId(searchText: string) {
    try {
      const {
        data: { items },
      } = await this.instance.get('search', {
        params: {
          part: 'id',
          q: searchText,
        },
      });

      return items[0].id;
    } catch (error) {
      throw error;
    }
  }

  public async addSongForPlaylist(snippet: {
    playlistId: string;
    resourceId: { kind: string; videoId: string };
  }) {
    try {
      const { data } = await this.instance.post(
        'playlistItems',
        {
          snippet,
        },
        {
          params: { part: 'snippet' },
        },
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getPlaylistItem() {
    try {
      const { data } = await this.instance.get('playlistItems', {
        params: {
          part: 'snippet',
          playlistId: '',
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
