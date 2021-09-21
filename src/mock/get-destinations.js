import { getRandomInteger } from "./get-random-integer";

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const CITIES = ['Chamonix', 'Geneva', 'Amsterdam'];

export const generationCity = () =>{
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
};

const generationDescription = () =>{
  const descriptionsArray = new Array();

  const randomCountDescription = getRandomInteger(1, 5);
  let randomIndex;

  for (let number = 0; number < randomCountDescription; number++){
    randomIndex = getRandomInteger(0, DESCRIPTIONS.length - 1);
    descriptionsArray.push(DESCRIPTIONS[randomIndex]);
  }

  const uniqDescriptionsArray = new Set(descriptionsArray);
  const description = Array.from(uniqDescriptionsArray).join(' ');

  return description;
};

export const generationDestinations = () => {
  const destinationArray = new Array(CITIES.length);

  for (let index = 0; index < CITIES.length; index++){
    destinationArray[index] = { description: generationDescription(),
      name: CITIES[index],
      pictures: []};
  }

  return destinationArray;
};


export const getDestination = (destinationArray, name) => {
  const destination = destinationArray.filter((destinationItem) => destinationItem.name === name);

  return destination[0];
};
