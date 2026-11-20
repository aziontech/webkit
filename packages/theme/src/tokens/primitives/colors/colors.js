import { alpha } from './alpha.js'
import { brand, brandPrimitives } from './brand.js'

export { brandPrimitives }

export const primitives = {
  base: {
    white: '#FFFFFF',
    black: '#000000'
  },
  blue: {
    50: '#E5F1FF',
    100: '#CCE4FF',
    200: '#99C9FF',
    300: '#66ADFF',
    400: '#3392FF',
    500: '#0072F5',
    600: '#005FCC',
    700: '#004799',
    800: '#003066',
    900: '#001833',
    950: '#000C1A'
  },
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    150: '#ECECEC',
    200: '#E5E5E5',
    250: '#DADADA',
    275: '#D1D1D1',
    300: '#B2B2B2',
    400: '#999999',
    500: '#808080',
    600: '#666666',
    650: '#535353',
    700: '#4D4D4D',
    750: '#2B2B2B',
    775: '#242424',
    800: '#1A1A1A',
    900: '#141414',
    950: '#0A0A0A'
  },
  violet: {
    50: '#F6F6FF',
    100: '#ECECFF',
    200: '#D9D7FA',
    300: '#B5B1F4',
    400: '#9F9AF1',
    500: '#8A84EC',
    600: '#756FE5',
    700: '#625BD5',
    800: '#524BBB',
    900: '#1F1E48',
    950: '#100F24'
  },
  orange: {
    50: '#FFF5EF',
    100: '#FFE7D8',
    200: '#FFCFB3',
    300: '#FFB180',
    400: '#FF8E4D',
    500: '#F3652B',
    600: '#D94A03',
    700: '#B03C02',
    800: '#8A2F02',
    900: '#692402',
    950: '#401602'
  },
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B'
  },
  slate: {
    50: '#F8F7FC',
    100: '#F0EFF8',
    200: '#E3E1F0',
    300: '#D3D2E6',
    400: '#BEBBD6',
    500: '#A39FBE',
    600: '#8884A4',
    700: '#6D698B',
    800: '#534F70',
    900: '#353040',
    950: '#13131A'
  },
  yellow: {
    50: '#FEF8E6',
    100: '#FDF2CE',
    200: '#FCE49C',
    300: '#FAD76B',
    400: '#F8CA3A',
    500: '#F7BD08',
    600: '#C59707',
    700: '#947105',
    800: '#634B03',
    900: '#312602',
    950: '#191301'
  },
  green: {
    50: '#F0FDF4',
    100: '#D0FBDF',
    200: '#A4F4C0',
    300: '#78EDA2',
    400: '#52E086',
    500: '#26D968',
    600: '#18B452',
    700: '#16833F',
    800: '#12542B',
    900: '#0A2916',
    950: '#03170B'
  },

  red: {
    50: '#FCE8E8',
    100: '#F9D2D2',
    200: '#F3A5A5',
    300: '#ED7878',
    400: '#E74B4B',
    500: '#E51A1A',
    600: '#B71515',
    700: '#891010',
    800: '#5B0B0B',
    900: '#2E0606',
    950: '#170303'
  },
  chart: {
    blue: { dark: '#2F86FF' },
    teal: { light: '#0D9488', dark: '#14A08C' },
    violet: { light: '#6D28D9', dark: '#8B5CF6' },
    orange: { light: '#E8590C', dark: '#E65A1E' },
    cyan: { light: '#0891B2', dark: '#0EA5C6' },
    lime: { light: '#4D7C0F', dark: '#6AA51A' },
    fuchsia: { light: '#C026D3', dark: '#D946EF' },
    'diverging-orange-2': { light: '#C96746', dark: '#CD8157' },
    'diverging-orange-3': { light: '#B57D6A', dark: '#9D725C' },
    'diverging-blue-2': { light: '#4377C3', dark: '#4D89D2' },
    'diverging-blue-3': { light: '#6E8CB8', dark: '#5D7EA7' }
  },
  brand,
  alpha
}

export default {
  primitives,
  brandPrimitives
}
