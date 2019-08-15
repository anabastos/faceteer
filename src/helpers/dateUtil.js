// import options from './helpers/options';

// const { ptBr } = options;
// const {
//   month,
//   week
// } = ptBr;

const getAge = (text) => {
  const dt = new Date();
  return dt.getFullYear() - parseInt(text.substring(text.length - 4, text.length));
}

export default getAge;