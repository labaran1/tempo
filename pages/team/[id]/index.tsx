import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import styled from 'styled-components';
import axios from 'axios';

const CardContainer = styled.div`
  background: #f9f9f9;
  width: 35rem;
  margin: 10px;
  padding: 2rem;
  box-shadow: 0 0 0.4rem #ccc;
  border-radius: 0.2rem;
  
`;
const AttributeTag = styled.span`
  color: gray;
`;
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
    id:string,
  }[];
}

const Index: NextPage = ({ teamName, leadInfo, teamMembers }: IProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <>Loading...</>;
  } else {
    return (
      <center style={{ margin: '2rem' }}>
        <h1>Team: {teamName}</h1>
        <CardContainer>
          <h4>Team Lead</h4>
          <div>
            <img src={leadInfo[0].avatarUrl} alt='user-avatar' />
            {/* <Image src={leadInfo[0].avatarUrl} width={500} height={500} alt='user-avatar' /> */}
          </div>

          <span style={{ display: 'block' }}>
            <AttributeTag> FullName:</AttributeTag>{' '}
            {leadInfo[0].firstName + ' ' + leadInfo[0].lastName}
          </span>
          <span>location: {leadInfo[0].location}</span>
        </CardContainer>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
          {teamMembers?.map((mem) => (
            <CardContainer key={mem.id} style={{ marginTop: '2rem' }}>
              <div>
                <img src={mem.avatarUrl} alt='user-avatar' />
                {/* <Image src={mem.avatarUrl} width={500} height={500} alt='user-avatar' /> */}
              </div>

              <span style={{ display: 'block' }}>
                <AttributeTag> FullName: </AttributeTag>
                {mem.firstName + ' in' + mem.lastName}
              </span>
              <span style={{ display: 'block' }}>
                {' '}
                <AttributeTag>Location: </AttributeTag>
                {mem.location}
              </span>
            </CardContainer>
          ))}
        </div>
      </center>
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
