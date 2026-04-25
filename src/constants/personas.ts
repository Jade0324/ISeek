/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Persona {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: 'MALE' | 'FEMALE';
  citizenship: string;
  location: string;
  bloodType: string;
  age: number;
}

export const PHILIPPINE_PERSONAS: Persona[] = [
  {
    firstName: "JUAN",
    lastName: "DELA CRUZ",
    birthdate: "05/15/1990",
    gender: "MALE",
    citizenship: "FILIPINO",
    location: "Quezon City",
    bloodType: "O+",
    age: 34
  },
  {
    firstName: "MARIA",
    lastName: "SANTOS",
    birthdate: "08/21/1985",
    gender: "FEMALE",
    citizenship: "FILIPINO",
    location: "Manila",
    bloodType: "A-",
    age: 39
  },
  {
    firstName: "JOSE",
    lastName: "RIZAL",
    birthdate: "06/19/1861",
    gender: "MALE",
    citizenship: "FILIPINO",
    location: "Calamba, Laguna",
    bloodType: "B+",
    age: 163
  },
  {
    firstName: "ANDRES",
    lastName: "BONIFACIO",
    birthdate: "11/30/1863",
    gender: "MALE",
    citizenship: "FILIPINO",
    location: "Tondo, Manila",
    bloodType: "AB+",
    age: 161
  },
  {
    firstName: "CATRIONA",
    lastName: "MAGSAYSAY",
    birthdate: "01/06/1994",
    gender: "FEMALE",
    citizenship: "FILIPINO",
    location: "Albay",
    bloodType: "O-",
    age: 30
  },
  {
    firstName: "MANNY",
    lastName: "PACQUIAO",
    birthdate: "12/17/1978",
    gender: "MALE",
    citizenship: "FILIPINO",
    location: "General Santos",
    bloodType: "A+",
    age: 45
  },
  {
    firstName: "CORAZON",
    lastName: "AQUINO",
    birthdate: "01/25/1933",
    gender: "FEMALE",
    citizenship: "FILIPINO",
    location: "Tarlac",
    bloodType: "B-",
    age: 91
  },
  {
    firstName: "FERDINAND",
    lastName: "MARCOS",
    birthdate: "09/11/1917",
    gender: "MALE",
    citizenship: "FILIPINO",
    location: "Ilocos Norte",
    bloodType: "O+",
    age: 106
  },
  {
    firstName: "LEA",
    lastName: "SALONGA",
    birthdate: "02/22/1971",
    gender: "FEMALE",
    citizenship: "FILIPINO",
    location: "Angeles City",
    bloodType: "AB-",
    age: 53
  },
  {
    firstName: "PIA",
    lastName: "WURTZBACH",
    birthdate: "09/24/1989",
    gender: "FEMALE",
    citizenship: "FILIPINO",
    location: "Cagayan de Oro",
    bloodType: "A+",
    age: 34
  }
];
