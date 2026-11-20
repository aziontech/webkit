export interface PhoneInputCountry {
  code: string
  dialCode: string
  mask: string | string[]
  label: string
}

export const defaultCountries: PhoneInputCountry[] = [
  { code: 'US', dialCode: '+1', mask: '(###) ###-####', label: 'United States' },
  { code: 'BR', dialCode: '+55', mask: ['(##) ####-####', '(##) #####-####'], label: 'Brazil' },
  { code: 'GB', dialCode: '+44', mask: '#### ######', label: 'United Kingdom' },
  { code: 'PT', dialCode: '+351', mask: '### ### ###', label: 'Portugal' },
  { code: 'ES', dialCode: '+34', mask: '### ### ###', label: 'Spain' },
  { code: 'AR', dialCode: '+54', mask: ['## ####-####', '# ## ####-####'], label: 'Argentina' },
  { code: 'MX', dialCode: '+52', mask: '## #### ####', label: 'Mexico' },
  { code: 'CL', dialCode: '+56', mask: '# #### ####', label: 'Chile' },
  { code: 'CO', dialCode: '+57', mask: '### ### ####', label: 'Colombia' },
  { code: 'DE', dialCode: '+49', mask: ['### #######', '#### #######'], label: 'Germany' },
  { code: 'FR', dialCode: '+33', mask: '# ## ## ## ##', label: 'France' },
  { code: 'IT', dialCode: '+39', mask: '### ### ####', label: 'Italy' },
  { code: 'AF', dialCode: '+93', mask: ['### ### ###', '### ### ####'], label: 'Afghanistan' },
  {
    code: 'AX',
    dialCode: '+358',
    mask: ['### ###', '### ####', '### ## ###', '### ### ###', '### #######'],
    label: 'Åland Islands'
  },
  {
    code: 'AL',
    dialCode: '+355',
    mask: ['### ## ###', '### ### ###', '### ### ####'],
    label: 'Albania'
  },
  {
    code: 'DZ',
    dialCode: '+213',
    mask: ['### ## ###', '### ### ###', '#### ## ## ##'],
    label: 'Algeria'
  },
  { code: 'AS', dialCode: '+1', mask: '(###) ###-####', label: 'American Samoa' },
  { code: 'AD', dialCode: '+376', mask: ['### ###', '### ### ###'], label: 'Andorra' },
  { code: 'AO', dialCode: '+244', mask: '### ### ###', label: 'Angola' },
  { code: 'AI', dialCode: '+1', mask: '(###) ###-####', label: 'Anguilla' },
  { code: 'AG', dialCode: '+1', mask: '(###) ###-####', label: 'Antigua and Barbuda' },
  { code: 'AM', dialCode: '+374', mask: ['### ## ###', '### ######'], label: 'Armenia' },
  { code: 'AW', dialCode: '+297', mask: '### ####', label: 'Aruba' },
  { code: 'AC', dialCode: '+247', mask: '#####', label: 'Ascension Island' },
  { code: 'AU', dialCode: '+61', mask: '### ### ###', label: 'Australia' },
  {
    code: 'AT',
    dialCode: '+43',
    mask: [
      '####',
      '## ###',
      '### ###',
      '### ####',
      '### ## ###',
      '### ### ###',
      '#### ######',
      '### ### ## ###',
      '### ### ### ###',
      '### ### ### ####'
    ],
    label: 'Austria'
  },
  { code: 'AZ', dialCode: '+994', mask: ['### ### ###', '### ### ## ##'], label: 'Azerbaijan' },
  { code: 'BS', dialCode: '+1', mask: '(###) ###-####', label: 'Bahamas' },
  { code: 'BH', dialCode: '+973', mask: '#### ####', label: 'Bahrain' },
  {
    code: 'BD',
    dialCode: '+880',
    mask: ['### ###', '### ####', '### ## ###', '### ### ###', '### ### ####', '#####-######'],
    label: 'Bangladesh'
  },
  { code: 'BB', dialCode: '+1', mask: '(###) ###-####', label: 'Barbados' },
  { code: 'BY', dialCode: '+375', mask: ['### ### ###', '# ### ###-##-##'], label: 'Belarus' },
  { code: 'BE', dialCode: '+32', mask: ['# ### ## ##', '### ## ## ##'], label: 'Belgium' },
  { code: 'BZ', dialCode: '+501', mask: '###-####', label: 'Belize' },
  { code: 'BJ', dialCode: '+229', mask: '## ## ## ## ##', label: 'Benin' },
  { code: 'BM', dialCode: '+1', mask: '(###) ###-####', label: 'Bermuda' },
  { code: 'BT', dialCode: '+975', mask: ['### ####', '## ## ## ##'], label: 'Bhutan' },
  { code: 'BO', dialCode: '+591', mask: '#### ####', label: 'Bolivia' },
  {
    code: 'BA',
    dialCode: '+387',
    mask: ['### ## ###', '### ### ###'],
    label: 'Bosnia and Herzegovina'
  },
  { code: 'BW', dialCode: '+267', mask: ['### ####', '## ### ###'], label: 'Botswana' },
  { code: 'IO', dialCode: '+246', mask: '### ####', label: 'British Indian Ocean Territory' },
  { code: 'VG', dialCode: '+1', mask: '(###) ###-####', label: 'British Virgin Islands' },
  { code: 'BN', dialCode: '+673', mask: '### ####', label: 'Brunei' },
  {
    code: 'BG',
    dialCode: '+359',
    mask: ['### ###', '### ####', '### ## ###', '### ### ###'],
    label: 'Bulgaria'
  },
  { code: 'BF', dialCode: '+226', mask: '## ## ## ##', label: 'Burkina Faso' },
  { code: 'BI', dialCode: '+257', mask: '## ## ## ##', label: 'Burundi' },
  { code: 'KH', dialCode: '+855', mask: ['### ## ###', '### ### ###'], label: 'Cambodia' },
  { code: 'CM', dialCode: '+237', mask: '# ## ## ## ##', label: 'Cameroon' },
  { code: 'CA', dialCode: '+1', mask: '(###) ###-####', label: 'Canada' },
  { code: 'CV', dialCode: '+238', mask: '### ## ##', label: 'Cape Verde' },
  { code: 'BQ', dialCode: '+599', mask: '### ####', label: 'Caribbean Netherlands' },
  { code: 'KY', dialCode: '+1', mask: '(###) ###-####', label: 'Cayman Islands' },
  { code: 'CF', dialCode: '+236', mask: '## ## ## ##', label: 'Central African Republic' },
  { code: 'TD', dialCode: '+235', mask: '## ## ## ##', label: 'Chad' },
  { code: 'CN', dialCode: '+86', mask: ['## #### ####', '### #### ####'], label: 'China' },
  { code: 'CX', dialCode: '+61', mask: ['### ### ###', '#### ### ###'], label: 'Christmas Island' },
  {
    code: 'CC',
    dialCode: '+61',
    mask: ['### ### ###', '#### ### ###'],
    label: 'Cocos (Keeling) Islands'
  },
  { code: 'KM', dialCode: '+269', mask: '### ## ##', label: 'Comoros' },
  { code: 'CG', dialCode: '+242', mask: '## ### ####', label: 'Congo' },
  {
    code: 'CD',
    dialCode: '+243',
    mask: ['### ####', '### ## ###', '### ### ###', '#### ### ###'],
    label: 'Congo (DRC)'
  },
  { code: 'CK', dialCode: '+682', mask: '## ###', label: 'Cook Islands' },
  { code: 'CR', dialCode: '+506', mask: '#### ####', label: 'Costa Rica' },
  { code: 'CI', dialCode: '+225', mask: '## ## ## ####', label: "Côte d'Ivoire" },
  {
    code: 'HR',
    dialCode: '+385',
    mask: ['### ## ###', '### ### ###', '### ### ####'],
    label: 'Croatia'
  },
  {
    code: 'CU',
    dialCode: '+53',
    mask: ['### ###', '### ####', '### ## ###', '## #######', '### ### ####'],
    label: 'Cuba'
  },
  { code: 'CW', dialCode: '+599', mask: ['### ####', '# ### ####'], label: 'Curaçao' },
  { code: 'CY', dialCode: '+357', mask: '## ######', label: 'Cyprus' },
  { code: 'CZ', dialCode: '+420', mask: '### ### ###', label: 'Czechia' },
  { code: 'DK', dialCode: '+45', mask: '## ## ## ##', label: 'Denmark' },
  { code: 'DJ', dialCode: '+253', mask: '## ## ## ##', label: 'Djibouti' },
  { code: 'DM', dialCode: '+1', mask: '(###) ###-####', label: 'Dominica' },
  { code: 'DO', dialCode: '+1', mask: '(###) ###-####', label: 'Dominican Republic' },
  { code: 'EC', dialCode: '+593', mask: ['# ### ####', '## ### ####'], label: 'Ecuador' },
  {
    code: 'EG',
    dialCode: '+20',
    mask: ['### ## ###', '### ### ###', '### ### ####', '### ########'],
    label: 'Egypt'
  },
  { code: 'SV', dialCode: '+503', mask: '#### ####', label: 'El Salvador' },
  { code: 'GQ', dialCode: '+240', mask: '### ### ###', label: 'Equatorial Guinea' },
  { code: 'ER', dialCode: '+291', mask: ['### ####', '## ### ###'], label: 'Eritrea' },
  { code: 'EE', dialCode: '+372', mask: ['### ####', '#### ####'], label: 'Estonia' },
  { code: 'SZ', dialCode: '+268', mask: '#### ####', label: 'Eswatini' },
  { code: 'ET', dialCode: '+251', mask: ['### ### ###', '### ### ####'], label: 'Ethiopia' },
  { code: 'FK', dialCode: '+500', mask: '#####', label: 'Falkland Islands' },
  { code: 'FO', dialCode: '+298', mask: '## ## ##', label: 'Faroe Islands' },
  { code: 'FJ', dialCode: '+679', mask: '### ####', label: 'Fiji' },
  {
    code: 'FI',
    dialCode: '+358',
    mask: ['## ###', '### ###', '### ####', '### ## ###', '### ### ###', '### #######'],
    label: 'Finland'
  },
  { code: 'GF', dialCode: '+594', mask: ['### ### ###', '#### ## ## ##'], label: 'French Guiana' },
  { code: 'PF', dialCode: '+689', mask: '## ## ## ##', label: 'French Polynesia' },
  { code: 'GA', dialCode: '+241', mask: ['### ####', '## ## ## ##'], label: 'Gabon' },
  { code: 'GM', dialCode: '+220', mask: ['### ####', '### ### ###'], label: 'Gambia' },
  { code: 'GE', dialCode: '+995', mask: '### ## ## ##', label: 'Georgia' },
  { code: 'GH', dialCode: '+233', mask: ['### ### ###', '### ### ####'], label: 'Ghana' },
  { code: 'GI', dialCode: '+350', mask: '########', label: 'Gibraltar' },
  { code: 'GR', dialCode: '+30', mask: '### ### ####', label: 'Greece' },
  { code: 'GL', dialCode: '+299', mask: '## ## ##', label: 'Greenland' },
  { code: 'GD', dialCode: '+1', mask: '(###) ###-####', label: 'Grenada' },
  { code: 'GP', dialCode: '+590', mask: ['### ### ###', '#### ## ## ##'], label: 'Guadeloupe' },
  { code: 'GU', dialCode: '+1', mask: '(###) ###-####', label: 'Guam' },
  { code: 'GT', dialCode: '+502', mask: '#### ####', label: 'Guatemala' },
  { code: 'GG', dialCode: '+44', mask: ['### ### ####', '##### ######'], label: 'Guernsey' },
  { code: 'GN', dialCode: '+224', mask: ['### ## ###', '### ## ## ##'], label: 'Guinea' },
  { code: 'GW', dialCode: '+245', mask: '### ### ###', label: 'Guinea-Bissau' },
  { code: 'GY', dialCode: '+592', mask: '### ####', label: 'Guyana' },
  { code: 'HT', dialCode: '+509', mask: '## ## ####', label: 'Haiti' },
  { code: 'HN', dialCode: '+504', mask: '####-####', label: 'Honduras' },
  { code: 'HK', dialCode: '+852', mask: '#### ####', label: 'Hong Kong' },
  {
    code: 'HU',
    dialCode: '+36',
    mask: ['### ## ###', '### ### ###', '## ## ### ####'],
    label: 'Hungary'
  },
  { code: 'IS', dialCode: '+354', mask: ['### ####', '### ### ###'], label: 'Iceland' },
  { code: 'IN', dialCode: '+91', mask: '##### #####', label: 'India' },
  {
    code: 'ID',
    dialCode: '+62',
    mask: [
      '### ####',
      '### ## ###',
      '### ### ###',
      '####-###-###',
      '### ### ## ###',
      '### ### ### ###'
    ],
    label: 'Indonesia'
  },
  {
    code: 'IR',
    dialCode: '+98',
    mask: ['### ###', '### ####', '### ### ####', '#### ### ####'],
    label: 'Iran'
  },
  {
    code: 'IQ',
    dialCode: '+964',
    mask: ['### ## ###', '### ### ###', '### ### ####', '#### ### ####'],
    label: 'Iraq'
  },
  { code: 'IE', dialCode: '+353', mask: ['# ### ####', '## ### ####'], label: 'Ireland' },
  { code: 'IM', dialCode: '+44', mask: ['### ### ####', '##### ######'], label: 'Isle of Man' },
  { code: 'IL', dialCode: '+972', mask: ['#-###-####', '##-###-####'], label: 'Israel' },
  { code: 'JM', dialCode: '+1', mask: '(###) ###-####', label: 'Jamaica' },
  { code: 'JP', dialCode: '+81', mask: ['#-####-####', '##-####-####'], label: 'Japan' },
  { code: 'JE', dialCode: '+44', mask: ['### ### ####', '##### ######'], label: 'Jersey' },
  {
    code: 'JO',
    dialCode: '+962',
    mask: ['### ## ###', '### ### ###', '## #### ####'],
    label: 'Jordan'
  },
  { code: 'KZ', dialCode: '+7', mask: '### ### ####', label: 'Kazakhstan' },
  {
    code: 'KE',
    dialCode: '+254',
    mask: ['### ####', '### ## ###', '### ### ###', '#### ######'],
    label: 'Kenya'
  },
  { code: 'KI', dialCode: '+686', mask: ['## ###', '########'], label: 'Kiribati' },
  {
    code: 'XK',
    dialCode: '+383',
    mask: ['### ## ###', '### ### ###', '### ### ####', '### ### ## ###', '### ### ### ###'],
    label: 'Kosovo'
  },
  { code: 'KW', dialCode: '+965', mask: '### #####', label: 'Kuwait' },
  { code: 'KG', dialCode: '+996', mask: ['### ### ###', '#### ### ###'], label: 'Kyrgyzstan' },
  {
    code: 'LA',
    dialCode: '+856',
    mask: ['### ## ###', '### ### ###', '### ### ####', '### ## ### ###'],
    label: 'Laos'
  },
  { code: 'LV', dialCode: '+371', mask: '## ### ###', label: 'Latvia' },
  { code: 'LB', dialCode: '+961', mask: ['### ####', '## ### ###'], label: 'Lebanon' },
  { code: 'LS', dialCode: '+266', mask: '#### ####', label: 'Lesotho' },
  {
    code: 'LR',
    dialCode: '+231',
    mask: ['### ####', '### ## ###', '### ### ###', '### ### ####'],
    label: 'Liberia'
  },
  { code: 'LY', dialCode: '+218', mask: ['### ### ###', '###-#######'], label: 'Libya' },
  { code: 'LI', dialCode: '+423', mask: ['### ####', '### ### ###'], label: 'Liechtenstein' },
  { code: 'LT', dialCode: '+370', mask: '### #####', label: 'Lithuania' },
  {
    code: 'LU',
    dialCode: '+352',
    mask: [
      '####',
      '## ###',
      '### ###',
      '### ####',
      '### ## ###',
      '### ### ###',
      '### ### ####',
      '### ### ## ###'
    ],
    label: 'Luxembourg'
  },
  { code: 'MO', dialCode: '+853', mask: '#### ####', label: 'Macao' },
  { code: 'MG', dialCode: '+261', mask: ['### ### ###', '### ## ### ##'], label: 'Madagascar' },
  {
    code: 'MW',
    dialCode: '+265',
    mask: ['### ####', '### ### ###', '#### ## ## ##'],
    label: 'Malawi'
  },
  {
    code: 'MY',
    dialCode: '+60',
    mask: ['### ## ###', '### ### ###', '###-### ####'],
    label: 'Malaysia'
  },
  { code: 'MV', dialCode: '+960', mask: '###-####', label: 'Maldives' },
  { code: 'ML', dialCode: '+223', mask: '## ## ## ##', label: 'Mali' },
  { code: 'MT', dialCode: '+356', mask: '#### ####', label: 'Malta' },
  { code: 'MH', dialCode: '+692', mask: '###-####', label: 'Marshall Islands' },
  { code: 'MQ', dialCode: '+596', mask: ['### ### ###', '#### ## ## ##'], label: 'Martinique' },
  { code: 'MR', dialCode: '+222', mask: '## ## ## ##', label: 'Mauritania' },
  { code: 'MU', dialCode: '+230', mask: ['### ####', '#### ####'], label: 'Mauritius' },
  { code: 'YT', dialCode: '+262', mask: ['### ### ###', '#### ## ## ##'], label: 'Mayotte' },
  { code: 'FM', dialCode: '+691', mask: '### ####', label: 'Micronesia' },
  { code: 'MD', dialCode: '+373', mask: ['### ## ###', '#### ## ###'], label: 'Moldova' },
  {
    code: 'MC',
    dialCode: '+377',
    mask: ['### ## ###', '### ### ###', '## ## ## ## ##'],
    label: 'Monaco'
  },
  {
    code: 'MN',
    dialCode: '+976',
    mask: ['#### ####', '### ### ###', '### ### ####'],
    label: 'Mongolia'
  },
  { code: 'ME', dialCode: '+382', mask: ['### ## ###', '### ### ###'], label: 'Montenegro' },
  { code: 'MS', dialCode: '+1', mask: '(###) ###-####', label: 'Montserrat' },
  { code: 'MA', dialCode: '+212', mask: ['### ### ###', '## ## ## ## ##'], label: 'Morocco' },
  { code: 'MZ', dialCode: '+258', mask: ['## ### ###', '## ### ####'], label: 'Mozambique' },
  {
    code: 'MM',
    dialCode: '+95',
    mask: ['### ###', '### ####', '### ## ###', '## ### ####', '### ### ####'],
    label: 'Myanmar'
  },
  {
    code: 'NA',
    dialCode: '+264',
    mask: ['### ## ###', '### ### ###', '### ### ####'],
    label: 'Namibia'
  },
  { code: 'NR', dialCode: '+674', mask: '### ####', label: 'Nauru' },
  { code: 'NP', dialCode: '+977', mask: ['### ## ###', '###-#######'], label: 'Nepal' },
  { code: 'NL', dialCode: '+31', mask: '# #### ####', label: 'Netherlands' },
  { code: 'NC', dialCode: '+687', mask: '##.##.##', label: 'New Caledonia' },
  {
    code: 'NZ',
    dialCode: '+64',
    mask: ['### ## ###', '### ### ###', '### ### ####'],
    label: 'New Zealand'
  },
  { code: 'NI', dialCode: '+505', mask: '#### ####', label: 'Nicaragua' },
  { code: 'NE', dialCode: '+227', mask: '## ## ## ##', label: 'Niger' },
  { code: 'NG', dialCode: '+234', mask: ['### ### ####', '#### ### ####'], label: 'Nigeria' },
  { code: 'NU', dialCode: '+683', mask: ['####', '### ####'], label: 'Niue' },
  { code: 'NF', dialCode: '+672', mask: '# #####', label: 'Norfolk Island' },
  {
    code: 'KP',
    dialCode: '+850',
    mask: ['### ## ###', '### ### ####', '#### ### ####'],
    label: 'North Korea'
  },
  { code: 'MK', dialCode: '+389', mask: ['### ## ###', '### ### ###'], label: 'North Macedonia' },
  { code: 'MP', dialCode: '+1', mask: '(###) ###-####', label: 'Northern Mariana Islands' },
  { code: 'NO', dialCode: '+47', mask: '## ## ## ##', label: 'Norway' },
  { code: 'OM', dialCode: '+968', mask: '#### ####', label: 'Oman' },
  {
    code: 'PK',
    dialCode: '+92',
    mask: ['### ### ###', '### ### ####', '#### #######'],
    label: 'Pakistan'
  },
  { code: 'PW', dialCode: '+680', mask: '### ####', label: 'Palau' },
  {
    code: 'PS',
    dialCode: '+970',
    mask: ['### ## ###', '### ### ###', '#### ### ###'],
    label: 'Palestine'
  },
  { code: 'PA', dialCode: '+507', mask: ['### ####', '####-####'], label: 'Panama' },
  { code: 'PG', dialCode: '+675', mask: ['### ####', '#### ####'], label: 'Papua New Guinea' },
  { code: 'PY', dialCode: '+595', mask: '### ### ###', label: 'Paraguay' },
  { code: 'PE', dialCode: '+51', mask: ['# ### ####', '### ### ###'], label: 'Peru' },
  {
    code: 'PH',
    dialCode: '+63',
    mask: ['### ###', '### ## ###', '### ### ###', '### ### ####', '#### ### ####'],
    label: 'Philippines'
  },
  { code: 'PL', dialCode: '+48', mask: '### ### ###', label: 'Poland' },
  { code: 'PR', dialCode: '+1', mask: '(###) ###-####', label: 'Puerto Rico' },
  { code: 'QA', dialCode: '+974', mask: '#### ####', label: 'Qatar' },
  { code: 'RE', dialCode: '+262', mask: ['### ### ###', '#### ## ## ##'], label: 'Réunion' },
  {
    code: 'RO',
    dialCode: '+40',
    mask: ['### ###', '### ### ###', '#### ### ###'],
    label: 'Romania'
  },
  { code: 'RU', dialCode: '+7', mask: '### ###-##-##', label: 'Russia' },
  {
    code: 'RW',
    dialCode: '+250',
    mask: ['### ## ###', '### ### ###', '#### ### ###'],
    label: 'Rwanda'
  },
  {
    code: 'BL',
    dialCode: '+590',
    mask: ['### ### ###', '#### ## ## ##'],
    label: 'Saint Barthélemy'
  },
  { code: 'SH', dialCode: '+290', mask: ['####', '#####'], label: 'Saint Helena' },
  { code: 'KN', dialCode: '+1', mask: '(###) ###-####', label: 'Saint Kitts and Nevis' },
  { code: 'LC', dialCode: '+1', mask: '(###) ###-####', label: 'Saint Lucia' },
  { code: 'MF', dialCode: '+590', mask: ['### ### ###', '#### ## ## ##'], label: 'Saint Martin' },
  {
    code: 'PM',
    dialCode: '+508',
    mask: ['### ###', '### ## ##', '### ### ###'],
    label: 'Saint Pierre and Miquelon'
  },
  { code: 'VC', dialCode: '+1', mask: '(###) ###-####', label: 'Saint Vincent and the Grenadines' },
  {
    code: 'WS',
    dialCode: '+685',
    mask: ['## ###', '### ###', '## #####', '### ### ####'],
    label: 'Samoa'
  },
  { code: 'SM', dialCode: '+378', mask: ['## ## ## ##', '### ### ####'], label: 'San Marino' },
  { code: 'ST', dialCode: '+239', mask: '### ####', label: 'São Tomé and Príncipe' },
  { code: 'SA', dialCode: '+966', mask: ['### ### ###', '### ### ####'], label: 'Saudi Arabia' },
  { code: 'SN', dialCode: '+221', mask: '## ### ## ##', label: 'Senegal' },
  {
    code: 'RS',
    dialCode: '+381',
    mask: [
      '### ####',
      '### ## ###',
      '### ### ###',
      '### #######',
      '### ### ## ###',
      '### ### ### ###'
    ],
    label: 'Serbia'
  },
  { code: 'SC', dialCode: '+248', mask: '# ### ###', label: 'Seychelles' },
  { code: 'SL', dialCode: '+232', mask: ['### ## ###', '(###) ######'], label: 'Sierra Leone' },
  { code: 'SG', dialCode: '+65', mask: '#### ####', label: 'Singapore' },
  { code: 'SX', dialCode: '+1', mask: '(###) ###-####', label: 'Sint Maarten' },
  {
    code: 'SK',
    dialCode: '+421',
    mask: ['### ###', '### ####', '### ### ###', '#### ### ###'],
    label: 'Slovakia'
  },
  { code: 'SI', dialCode: '+386', mask: ['### ## ###', '### ### ###'], label: 'Slovenia' },
  { code: 'SB', dialCode: '+677', mask: ['## ###', '## #####'], label: 'Solomon Islands' },
  {
    code: 'SO',
    dialCode: '+252',
    mask: ['### ###', '### ####', '# #######', '## ### ####'],
    label: 'Somalia'
  },
  { code: 'ZA', dialCode: '+27', mask: '## ### ####', label: 'South Africa' },
  { code: 'KR', dialCode: '+82', mask: ['#-####-####', '##-####-####'], label: 'South Korea' },
  { code: 'SS', dialCode: '+211', mask: ['### ### ###', '#### ### ###'], label: 'South Sudan' },
  { code: 'LK', dialCode: '+94', mask: ['### ### ###', '### ### ####'], label: 'Sri Lanka' },
  { code: 'SD', dialCode: '+249', mask: ['### ### ###', '### ### ####'], label: 'Sudan' },
  { code: 'SR', dialCode: '+597', mask: ['### ###', '###-####'], label: 'Suriname' },
  { code: 'SJ', dialCode: '+47', mask: '## ## ## ##', label: 'Svalbard and Jan Mayen' },
  {
    code: 'SE',
    dialCode: '+46',
    mask: ['### ####', '### ## ###', '### ### ###', '###-### ## ##'],
    label: 'Sweden'
  },
  { code: 'CH', dialCode: '+41', mask: '## ### ## ##', label: 'Switzerland' },
  { code: 'SY', dialCode: '+963', mask: ['### ## ###', '### ### ###'], label: 'Syria' },
  {
    code: 'TW',
    dialCode: '+886',
    mask: ['### ## ###', '### ### ###', '#### ### ###'],
    label: 'Taiwan'
  },
  { code: 'TJ', dialCode: '+992', mask: '## ### ####', label: 'Tajikistan' },
  { code: 'TZ', dialCode: '+255', mask: ['### ### ###', '#### ### ###'], label: 'Tanzania' },
  {
    code: 'TH',
    dialCode: '+66',
    mask: ['### ## ###', '### ### ###', '### ### ####'],
    label: 'Thailand'
  },
  { code: 'TL', dialCode: '+670', mask: ['### ####', '#### ####'], label: 'Timor-Leste' },
  { code: 'TG', dialCode: '+228', mask: '## ## ## ##', label: 'Togo' },
  {
    code: 'TK',
    dialCode: '+690',
    mask: ['####', '## ###', '### ###', '### ####'],
    label: 'Tokelau'
  },
  { code: 'TO', dialCode: '+676', mask: ['## ###', '### ####'], label: 'Tonga' },
  { code: 'TT', dialCode: '+1', mask: '(###) ###-####', label: 'Trinidad and Tobago' },
  { code: 'TA', dialCode: '+290', mask: '####', label: 'Tristan da Cunha' },
  { code: 'TN', dialCode: '+216', mask: '## ### ###', label: 'Tunisia' },
  { code: 'TR', dialCode: '+90', mask: '### ### ## ##', label: 'Türkiye' },
  { code: 'TM', dialCode: '+993', mask: ['### ## ###', '# ## ######'], label: 'Turkmenistan' },
  { code: 'TC', dialCode: '+1', mask: '(###) ###-####', label: 'Turks and Caicos Islands' },
  { code: 'TV', dialCode: '+688', mask: ['## ###', '## ####', '### ####'], label: 'Tuvalu' },
  { code: 'VI', dialCode: '+1', mask: '(###) ###-####', label: 'U.S. Virgin Islands' },
  { code: 'UG', dialCode: '+256', mask: ['### ### ###', '#### ######'], label: 'Uganda' },
  { code: 'UA', dialCode: '+380', mask: ['### ### ###', '### ### ####'], label: 'Ukraine' },
  {
    code: 'AE',
    dialCode: '+971',
    mask: ['# ### ####', '## ### ####'],
    label: 'United Arab Emirates'
  },
  { code: 'UY', dialCode: '+598', mask: '#### ####', label: 'Uruguay' },
  { code: 'UZ', dialCode: '+998', mask: '## ### ## ##', label: 'Uzbekistan' },
  { code: 'VU', dialCode: '+678', mask: ['## ###', '### ####'], label: 'Vanuatu' },
  {
    code: 'VA',
    dialCode: '+39',
    mask: ['### ###', '### ####', '### ## ###', '### ### ###', '### ### ####', '### #### ####'],
    label: 'Vatican City'
  },
  { code: 'VE', dialCode: '+58', mask: '### ### ####', label: 'Venezuela' },
  { code: 'VN', dialCode: '+84', mask: ['### ### ###', '### ### ####'], label: 'Vietnam' },
  { code: 'WF', dialCode: '+681', mask: '## ## ##', label: 'Wallis and Futuna' },
  {
    code: 'EH',
    dialCode: '+212',
    mask: ['### ### ###', '## ## ## ## ##'],
    label: 'Western Sahara'
  },
  {
    code: 'YE',
    dialCode: '+967',
    mask: ['### ####', '### ## ###', '### ### ###', '#### ### ###'],
    label: 'Yemen'
  },
  { code: 'ZM', dialCode: '+260', mask: ['### ### ###', '### #######'], label: 'Zambia' },
  { code: 'ZW', dialCode: '+263', mask: ['### ### ###', '### ### ####'], label: 'Zimbabwe' }
]
