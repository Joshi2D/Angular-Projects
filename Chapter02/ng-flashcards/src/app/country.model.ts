export interface ICountry {
countryName : string;
countryRegion : string;
}

export interface IcountryCode{
  countryCode : string;
  countryDetail : ICountry;
}