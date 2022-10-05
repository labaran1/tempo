import type { NextPage } from 'next'
import axios from 'axios'
import { useEffect, useState} from 'react'
import Link from 'next/link'


const Home: NextPage = () => {
  const [searchValue, setSearchValue] = useState<string|null>("")
  const [teams, setTeams] = useState([])
  const [filteredTeam, setFilteredTeam] = useState([])
  const [displayMessage, setDisplayMessage] = useState<string|null>("")
  const searchUsers = () => {
    if (searchValue === '') {
      return;
    }

    const filtered = teams.filter((team:{name:string, id:string}) => {
      return team.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    if (filtered.length > 0) {
      setFilteredTeam(filtered);
    } else {
      setFilteredTeam([]);
      setDisplayMessage('No Data Found');
    }
  };

  const teamDetails = async (id:string, index:number) => {
    await axios
      .get('https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/teams/' + id)
      .then((res) => {
        setFilteredTeam((prev) => {
          let newTeams = [...prev];
          let a:any = newTeams[index];
          a['viewDetails'] = true;
          a['teamMembersId'] = res.data.teamMemberIds;
          a['teamLeadId'] = res.data.teamLeadId;
          return newTeams;
        });
      });
  };
useEffect(() => {
  axios
    .get('https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/teams/')
    .then((res) => {
      setTeams(res.data);
    });
}, []);

  
  return (
    <div>
      <input
        id='searchInput'
        type='text'
        placeholder='Search team'
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <button onClick={searchUsers}>Search</button>

      {filteredTeam?.length > 0 ? (
        filteredTeam.map((team:any, index:number) => {
          return (
            <div
              key={team.id}
              style={{
                background: '#ccc',
                width: '30rem',
                height: 'auto',
                margin: '2px',
                padding: '2rem',
              }}
            >
              <span>{team.name}</span>

              <span
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  teamDetails(team.id, index);
                }}
              >
                View Details
              </span>

              {team.viewDetails && (
                <div>
                  <Link href={`/team/${team.id}`} title='view team Info'>
                    <a>Members:{team.teamMembersId.length}</a>
                  </Link>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <>{displayMessage}</>
      )}
    </div>
  );
}

export default Home
