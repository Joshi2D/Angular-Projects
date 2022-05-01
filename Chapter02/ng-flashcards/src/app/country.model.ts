export interface ICountry {
countryName : string;
countryRegion : string;
countrySubregion : string;
countryLanguages : string;
countryFlag : string;
countryOrganizations : IOrganization[];
countryPopulation : number; 
countryArea : number;
countryNeighbours : string[];
countryCurrency : string;
countryCode : string;
countryCapital : string;
}

 interface IOrganization{
  orgCode : string;
  orgDetail : string;
}