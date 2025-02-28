import React, { useEffect, useState } from 'react';
import { Button, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import { RiQuestionLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { isDelegating, daoConnectedAndSameChain } from '../utils/general';
import { TX } from '../data/contractTX';

const PokeTokenButton = ({ wnzAddress }) => {
  const { errorToast } = useOverlay();
  const { submitTransaction } = useTX();
  const { daoMember, delegate } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { daochain } = useParams();
  const [loading, setLoading] = useState(false);

  const canSync = !isDelegating(daoMember) || delegate;

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handlePoke = async () => {
    setLoading(true);

    if (!wnzAddress) {
      setLoading(false);
      errorToast({
        title: 'There was an error poking transaction. Address missing.',
      });
    }

    await submitTransaction({
      tx: TX.POKE_WRAP_N_ZAP,
      localValues: { contractAddress: wnzAddress },
      args: [],
    });

    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex>
      {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
      canSync ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='top'
          label='Looks like some funds were sent directly to the DAO. Poke to update
                    the balance.'
        >
          <Button onClick={handlePoke} rightIcon={<RiQuestionLine />}>
            Poke Pending Deposit
          </Button>
        </Tooltip>
      ) : (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='bottom'
          label='Unable to poke token. Check that you are connected to correct network. Note, members who have delegated their voting power cannot poke tokens'
          bg='secondary.500'
        >
          <Button disabled>Poke Pending Deposit</Button>
        </Tooltip>
      )}
    </Flex>
  );
};

export default PokeTokenButton;
