const MapDict =
{
    /***
    We have 26 countries in our data file that have discrepancies with our topojson:

    -----------------------------------------------------------------------------
    |        COVID-19 Data File          |             TopoJSON                 |
    -------------------------------- Easy cases ---------------------------------
    | Mainland China                     | China
    | Macau                              | Macao
    | US                                 | United States of America
    | Ivory Coast                        | Côte d'Ivoire
    | UK                                 | United Kingdom
    | North Macedonia                    | Macedonia
    | Czech Republic                     | Czechia
    | Dominican Republic                 | Dominican Rep.
    | Saint Barthelemy                   | St-Barthélemy
    | Faroe Islands                      | Faeroe Is.
    | Bosnia and Herzegovina             | Bosnia and Herz.
    | Vatican City                       | Vatican
    | Republic of Ireland                | Ireland
    | St. Martin                         | St-Martin
    | occupied Palestinian territory     | Palestine
    | ('St. Martin',)                    | St-Martin
    | Congo (Kinshasa)                   | Dem. Rep. Congo
    | Gibraltar                          | (Technically part of the United Kingdom)
    | French Guiana                      | (Technically part of France)
    | Holy See                           | (Technically part of Vatican)
    | Martinique                         | (Technically part of France)
    | Reunion                            | (Technically part of France)
    | North Ireland                      | (This is part of the United Kingdom)
    -------------------------------- Problem children ---------------------------------
    | Channel Islands                    | ('Jersey' and 'Guernsey' are listed separately)
    | Others                             | (Cruise ships)
    -----------------------------------------------------------------------------

    This dictionary is designed to provide an easy translation between our COVID-19 file
    country names and our TopoJSON file country names.  There are some exceptions that
    go beyond simple lookup that will be dealt with separately.
    ***/

    'Mainland China'                 : 'China',
    'Macau'                          : 'Macao',
    'US'                             : 'United States of America',
    'Ivory Coast'                    : "Côte d'Ivoire",
    'UK'                             : 'United Kingdom',
    'North Macedonia'                : 'Macedonia',
    'Czech Republic'                 : 'Czechia',
    'Dominican Republic'             : 'Dominican Rep.',
    'Saint Barthelemy'               : 'St-Barthélemy',
    'Faroe Islands'                  : 'Faeroe Is.',
    'Bosnia and Herzegovina'         : 'Bosnia and Herz.',
    'Vatican City'                   : 'Vatican',
    'Republic of Ireland'            : 'Ireland',
    'St. Martin'                     : 'St-Martin',
    'occupied Palestinian territory' : 'Palestine',
    "('St. Martin',)"                : 'St-Martin',
    'Congo (Kinshasa)'               : 'Dem. Rep. Congo',
    'Gibraltar'                      : 'United Kingdom',
    'French Guiana'                  : 'France',
    'Holy See'                       : 'Vatican',
    'Martinique'                     : 'France',
    'Reunion'                        : 'France',
    'North Ireland'                  : 'United Kingdom',
};
