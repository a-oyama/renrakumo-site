// メインページ

'use client'

import { useState, useEffect } from "react"
// supabase連携
import { createClient } from "@/utils/supabase/client"
// カレンダー
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { DayCellContentArg } from "@fullcalendar/core/index.js"
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from "@fullcalendar/interaction"
import { DateSelectArg } from "@fullcalendar/core/index.js"
import { EventClickArg } from "@fullcalendar/core/index.js"

// 画面描画
import { Suspense } from "react"
import Loading from "@/app/loading"

// 連絡記事
import Renraku from './Renraku'

  // 祝日追加
const holidays = [
  '2023-12-31',
  '2024-01-07',
  '2024-02-10',
  '2024-02-11',
  '2024-03-19',
  '2024-04-28',
  '2024-05-02',
  '2024-05-03',
  '2024-05-04',
  '2024-05-05',
  '2024-07-14',
  '2024-08-10',
  '2024-08-11',
  '2024-09-15',
  '2024-09-21',
  '2024-10-13',
  '2024-11-02',
  '2024-11-03',
  '2024-11-22',
  '2024-12-31',
  '2025-02-10',
  '2025-02-23',
  '2025-03-19',
];

// カレンダー日マス設定
const addDayClassNames = (arg: DayCellContentArg) => {
  const day = arg.date.getDay();
  const dateStr = arg.date.toISOString().split('T')[0];//yyyy-mm-ddを認識
  if (day === 6) return ["saturday-cell"]; // 土曜
  if (day === 0) return ["sunday-cell"];   // 日曜
  if (holidays.includes(dateStr)) {
    return ["holiday-cell"];//祝日
  }
  return [];
};

const Calendar = () => {
  const supabase = createClient() //supabase連携
  const [events, setEvents] = useState<EventInit[]>([]); //状態管理

// イベント状態管理
useEffect(() => {
  fetchEvents();
}, []);

// eventテーブル取得
  const fetchEvents = async () => {
    const { data, error } = await supabase
    .from('events')
    .select('*');

    if (error)
       console.error(error);
    else setEvents(data);
};

  // イベント追加
  const handleDateSelect = async (selectInfo: DateSelectArg) => {

    const title = prompt('イベントのタイトルを入力してください');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {

      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };

      const { data, error } = await supabase
      .from('events')
      .insert([newEvent]);

      // 処理終了時にsupabase再度取得
         if (error || !data ) { // if文でundefind防止
          console.error('データの挿入に失敗しました:', error);
        } else {
          fetchEvents();
      }
      window.location.reload(); //処理終了時にリロード
    }
  };

  // イベント削除
  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (window.confirm(`'${clickInfo.event.title}' を削除しますか？`)) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', clickInfo.event.id);//イベントidが合致するものを取得

      if (error) {
        console.error(error);
      } else {
        clickInfo.event.remove();
      }
    }
  };

  // 画面表示
  return (
    <Suspense fallback={<Loading />}> 

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      selectable={true}
      events={events}
      locales={allLocales}
      locale="jp"
      dayCellContent={(event: DayCellContentArg) =>
        (event.dayNumberText = event.dayNumberText.replace("日", ""))
      }// 日を消す
      dayCellClassNames={addDayClassNames}//土日配色
      select={handleDateSelect}
      eventClick={handleEventClick}
      displayEventTime={false}
      businessHours={true}
      selectLongPressDelay={0}
    />

    <div className="py-6">
    <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-2 w-4/4">
      連絡事項
    </h2>
    </div>
    
    {/* 連絡網記事 */}
    <Renraku />
  
    </Suspense>
  )
}

export default Calendar;