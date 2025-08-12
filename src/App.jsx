import { use, useEffect, useState } from 'react'
import './App.css'
import Buscar from './component/Buscar.jsx';
import Spinner from './component/Spinner.jsx';
import Card from './component/Card.jsx'
import { useDebounce } from 'react-use';
 
// hooks são funções do react que permitem utilizar recursos como estado e efeitos colaterais (useState/useEffect).
 
const App = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const[errorMessage, setErrorMessage] = useState(''); // desestruturação (quando atribui uma variável e uma função a uma variável/constante). A função altera o valor da variável.
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('')  
  
  useDebounce( () => setDebouncedTerm(termoBusca), 500, [termoBusca]) // hook que espera 500ms para atualizar o termo de busca, evitando requisições excessivas.
  
  const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
  const API_URL_BASE = 'https://api.themoviedb.org/3'
  const API_OPCOES = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    }
  } // o formato json é exigência da API
 
 
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try{
      const endpoint = query?
      `${API_URL_BASE}/search/movie?query=${query}`
      :`${API_URL_BASE}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPCOES);
      if(!response.ok){
        throw new Error('Erro na requisição.');
      }
 
      const data = await response.json();
 
      if(data.Response == "False"){
        setErrorMessage(data.Error || "Falha ao consultar filmes")
        setMovieList([]);
        return;
      }
 
      setMovieList(data.results || []);
 
     
    } catch (error){
      console.error(`Erro ao buscar filmes: ${error}`);
      setErrorMessage('Erro ao buscar filmes. Favor tentar mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }
 
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm])
 
  return(
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Banner do Herói" />
          <h1>
            Encontre Os <span className="text-gradient">Filmes</span> Que Você vai Gostar
          </h1>
        </header>
        <Buscar termoBusca={termoBusca} setTermoBusca={setTermoBusca}/>
        <h1 className="text-white">{termoBusca}</h1>
        <section className='all-movies'>
          <h2 className="mt-[40px]">Todos os filmes</h2>
          {isLoading? (
            <Spinner/>
          ): errorMessage? (
          <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <Card movie={movie}/>
              ))}
            </ul>
          ) }
        </section>
      </div>
    </main>
  )
}
 
export default App
 
// && = Operador if, se a primeira condição for falsa, o resto da linha não é executado, etc. Não dá pra usar if no return (nem comentário, aliás).
 
 
 