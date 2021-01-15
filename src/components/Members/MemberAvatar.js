import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Avatar, Box, Skeleton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useDao } from '../../contexts/PokemolContext';

import { truncateAddr } from '../../utils/helpers';

const MemberAvatar = ({ member }) => {
  const [dao] = useDao();

  const hasProfileImage =
    member && member.profile && member.profile.image && member.profile.image[0];

  return (
    <Flex direction='row' alignItems='center'>
      {hasProfileImage ? (
        <Box
          as={RouterLink}
          to={
            dao?.graphData
              ? `/dao/${dao.address}/profile/${member.memberAddress}`
              : null
          }
        >
          <Avatar
            name={member.memberAddress}
            src={`${'https://ipfs.infura.io/ipfs/' +
              member.profile.image[0].contentUrl['/']}`}
            mr={3}
            size='xs'
          />
          <Box fontSize='sm' fontFamily='heading'>
            {member.profile.name || truncateAddr(member.memberAddress)}{' '}
            <span>{member.profile.emoji || ''} </span>
          </Box>
        </Box>
      ) : (
        <>
          <Skeleton
            isLoaded={member?.memberAddress && member.memberAddress !== '0x0'}
          >
            <Flex direction='row' alignItems='center'>
              {member?.memberAddress && (
                <Box
                  as={RouterLink}
                  to={
                    dao?.graphData
                      ? `/dao/${dao.address}/profile/${member.memberAddress}`
                      : null
                  }
                >
                  <Avatar
                    name={member.memberAddress}
                    src={makeBlockie(member.memberAddress)}
                    mr={3}
                    size='xs'
                  />
                  <Box fontSize='sm' fontFamily='heading'>
                    {truncateAddr(member.memberAddress)}
                  </Box>
                </Box>
              )}
            </Flex>
          </Skeleton>
        </>
      )}
    </Flex>
  );
};

export default MemberAvatar;
