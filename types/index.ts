
// プロフィール型
export interface ProfileType {
    id: string
    name: string
    introduce: string | null
    avatar_url: string | null
  }

  // カレンダースケジュール
  export interface EventType {
    id: string;
    title: string;
    start: string;
    end: string | null;
    allDay: string;
  }

  // 連絡記事
  export interface RenrakuType {
    id: string
    title: string
    content: string
    user_id: string
    image_url: string | null
    updated_at: string
    created_at: string
  }