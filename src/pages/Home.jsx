import React from "react";
import { styled } from "styled-components";


const Home = () => {
    return <HomeContainer>
        <HomeAppContainer>
            <AppHeaderContainer>
                <AppLogo>Art & Chai</AppLogo>
            </AppHeaderContainer>
            <ProfileContentContainer>
                <MainProfileImage src="https://hildurko.com/wp-content/uploads/2020/08/Calm-Lake-Landscape-Easy-acrylic-painting-for-beginners-PaintingTutorial-Painting-ASMR.jpg"/>
                <ProfileInfoContainer>
                    <ProfileName>
                        Ravi Maurya
                    </ProfileName>
                    <ProfileGender>
                        M
                    </ProfileGender>,
                    <ProfileAge>
                        22
                    </ProfileAge>
                </ProfileInfoContainer>
                <ProfileWriteUpContainer>
                    <WriteUpQuestion>What do I love?</WriteUpQuestion>
                    <WriteUpAnswer>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt excepturi quaerat quidem natus facere deleniti fugiat placeat, libero sit tempore doloribus nihil, est facilis incidunt pariatur expedita dignissimos hic officia.</WriteUpAnswer>
                </ProfileWriteUpContainer>
                <AdditionContentContainer>
                    <WriteUpQuestion>Some peaceful paintings</WriteUpQuestion>
                    <MainProfileImage src="https://i.ytimg.com/vi/3jEwpJKyKMM/maxresdefault.jpg"/>
                </AdditionContentContainer>
                <AdditionContentContainer>
                    <WriteUpQuestion>What do you love?</WriteUpQuestion>
                    <MainProfileImage src="https://www.myhobbyclass.com/storage/Acrylic-painting-of-Spring-season-landscape-painting-with-tree-on.jpg"/>
                </AdditionContentContainer>
            </ProfileContentContainer>
        </HomeAppContainer>
    </HomeContainer>
}

const HomeContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Noto Sans', sans-serif;
`;

const HomeAppContainer = styled.div`
    background-color: #f4f4f4;
    box-shadow: #00000052 5px 5px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const AppLogo = styled.div`
    color: #ec4b66;
    font-family: 'Pacifico', cursive;
    font-size: 1.4rem;
`;

const ProfileContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const MainProfileImage = styled.img`
    width: 100%;
    border-radius: 1rem;
`;

const ProfileInfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: end;
    padding: 0.5rem 0;
`;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1.3rem;
    padding-right: 0.5rem;
`;

const ProfileGender = styled.span`
    font-weight: 600;
`;
const ProfileAge = styled.span`
    font-weight: 600;
`;

const ProfileWriteUpContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

const WriteUpQuestion = styled.div`
    font-weight: bold;
    padding-bottom: 0.4rem;
`;

const WriteUpAnswer = styled.div``;

const AdditionContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

export default Home;