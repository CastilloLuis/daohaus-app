import React, { useEffect, useState } from 'react';
import { Box, Flex, Icon, Button, IconButton } from '@chakra-ui/core';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { useUser, useNetwork, useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';

const Header = () => {
  const location = useLocation();
  const [user] = useUser();
  const [network] = useNetwork();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [pageTitle, setPageTitle] = useState();
  const [showDaoSwitcher, setShowDaoSwitcher] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Hub');
    } else if (location.pathname === `/dao/${dao?.address}`) {
      setPageTitle('Overview');
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
      // TODO proposals id regex
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
    } else if (
      location.pathname === `/dao/${dao?.address}/proposals/new/member`
    ) {
      setPageTitle(
        'New ' + theme.daoMeta.member + ' ' + theme.daoMeta.proposal,
      );
    } else if (location.pathname === `/dao/${dao?.address}/proposals/new`) {
      setPageTitle('New ' + theme.daoMeta.proposal);
    } else if (location.pathname === `/dao/${dao?.address}/members`) {
      setPageTitle(theme.daoMeta.members);
    } else if (location.pathname === `/dao/${dao?.address}/bank`) {
      setPageTitle(theme.daoMeta.bank);
    } else if (
      location.pathname === `/dao/${dao?.address}/profile/${user?.username}`
    ) {
      setPageTitle(`${theme.daoMeta.member} Profile`);
    } else {
      // TODO pull from graph data
      setPageTitle(dao?.apiMeta?.name);
    }
  }, [location, dao, theme.daoMeta, setPageTitle]);

  return (
    <>
      <Flex direction='row' justify='space-between' p={6}>
        <Flex direction='row' justify='flex-start' align='center'>
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mr={10}>
            {pageTitle}
          </Box>
          {location.pathname === `/` && user && (
            <Button as='a' href='https://3box.io/hub' target='_blank'>
              Edit 3Box Profile
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/proposals` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new`}
              rightIcon={<RiAddFill />}
            >
              New {theme.daoMeta.proposal}
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/members` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new/member`}
            >
              Apply
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/bank` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new`}
              rightIcon={<RiAddFill />}
            >
              Add Asset
            </Button>
          )}
        </Flex>

        <Flex direction='row' justify='flex-end' align='center'>
          <Box fontSize='md' mr={5} as='i' fontWeight={200}>
            {network.network}
          </Box>

          {user ? (
            <>
              <Button
                variant='outline'
                onClick={() => setShowDaoSwitcher(true)}
              >
                <UserAvatar user={user.profile ? user.profile : user} />
              </Button>

              <DaoSwitcherModal
                isOpen={showDaoSwitcher}
                setShowModal={setShowDaoSwitcher}
              />
            </>
          ) : (
            <Web3SignIn />
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default Header;
