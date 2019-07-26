import notes from './notes'
import lyrics from './lyrics'
import wallpaper from './wallpaper'
import links from './links'

import scoremanual from './scoremanual'
import scorenum from './scorenum'
import scorexml from './scorexml'


export const Notes = notes
export const Lyrics = lyrics
export const Wallpaper = wallpaper
export const Links = links

export const ScoreManual = scoremanual
export const ScoreNum = scorenum
export const ScoreXml = scorexml

export const OBEvent = {
  // AUTO_PLAY_NUM_SCORE: 'AUTO_PLAY_NUM_SCORE',
  PAUSE_AUTO_PLAY: 'PAUSE_AUTO_PLAY',

  AUTO_PLAY_XML_SCORE: 'AUTO_PLAY_XML_SCORE',
  PAUSE_XML_AUTO_PLAY: 'PAUSE_XML_AUTO_PLAY',

  CHANGE_WALLPAPER: 'CHANGE_WALLPAPER',

  LOAD_SHEET_MUSIC: 'LOAD_SHEET_MUSIC',
  START_AUTO_PLAY: 'START_AUTO_PLAY',
  STOP_AUTO_PLAY: 'STOP_AUTO_PLAY',
  // 设置播放进度
  SET_AUTO_PLAY_PROGRESS: 'SET_AUTO_PLAY_PROGRESS',

  // 自动播放事件
  // 乐曲载入事件
  SHEET_MUSIC_LOADED: 'SHEET_MUSIC_LOADED',
  // 播放停止/暂停事件
  AUTO_PLAY_STOPPED: 'AUTO_PLAY_STOPPED',
  // 播放开始事件
  AUTO_PLAY_STARTED: 'AUTO_PLAY_STARTED',
  // 播放进度更新
  PLAY_PROGRESS_UPDATE: 'PLAY_PROGRESS_UPDATE',
}

export const CDN_JSDELIVR_STATIC = 'https://cdn.jsdelivr.net/gh/warpprism/cdn@latest/autopiano/static/'
