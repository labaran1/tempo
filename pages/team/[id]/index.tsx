import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

import axios from 'axios';

interface IProps {
  teamName: string;
  leadInfo: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    location: string;
  }[];
  teamMembers: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    location: string;
  }[];
}

const Index: NextPage = ({ teamName, leadInfo, teamMembers }: IProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <>Loading...</>;
  } else {
    return (
      <div>
        <h1>Team: {teamName}</h1>
        <div>
          <h4>Team Lead</h4>
          <img src={leadInfo[0].avatarUrl} alt='user-avatar' />
          {/* <Image src={leadInfo[0].avatarUrl} width={500} height={500} alt='user-avatar' /> */}
          <span>
            Name: {leadInfo[0].firstName + ' ' + leadInfo[0].lastName}
          </span>
          <span>location: {leadInfo[0].location}</span>
        </div>
        {teamMembers?.map((mem) => (
          <div key={mem.id}>
            <img src={mem.avatarUrl} alt='user-avatar' />
            {/* <Image src={mem.avatarUrl} width={500} height={500} alt='user-avatar' /> */}
            <span style={{ display: 'block' }}>
              Name: {mem.firstName + ' in' + mem.lastName}
            </span>
            <span style={{ display: 'block' }}>Location: {mem.location}</span>
          </div>
        ))}
      </div>
    );
  }
};

export default Index;


export const getStaticPaths: GetStaticPaths = async () => {
  let newPath:{params:{id:string}}[] = [];
  await axios
    .get('https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/teams/')
    .then((res) => {
      res.data.forEach((team:{name:string, id:string}) => {
        let a = { params: { id: team.id } };
        newPath.push(a);
      });
    });
  return {
    paths: newPath,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params} = context;
  let users:{}[] = [];
  let teamMemberIds:string[] = [];
  let teamMembers:{}[] = [];
  let teamName:string;
  let leadId:string;
  let leadInfo:{}[] = [];

  await axios
    .get(
      'https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/teams/' +
        params.id
    )
    .then((res) => {
      teamName = res.data.name;
      users.push({ type: 'Leader', id: res.data.teamLeadId });
      leadId = res.data.teamLeadId;
      teamMemberIds = res.data.teamMemberIds;
      res.data.teamMemberIds.forEach((member:string) => {
        users.push({ type: 'Member', id: member });
      });
    })
    .then(async () => {
      for (let i = 0; i < teamMemberIds.length; i++) {
        await axios
          .get(
            'https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/users/' +
              teamMemberIds[i]
          )
          .then((res) => {
            teamMembers.push(res.data);
          });
      }
    });

  await axios
    .get(
      'https://cgjresszgg.execute-api.eu-west-1.amazonaws.com/users/' + leadId
    )
    .then((res) => {
      let a = { ...res.data };
      a['type'] = 'Leader';
      leadInfo.push(a);
    });

  if (!leadInfo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {teamName, leadInfo, teamMembers }, // will be passed to the page component as props
  };


};
