import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback,last) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
      console.log('called back');
    });
  }, [isFetching,callback]);

  function handleScroll() {
    if ((last === undefined && window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight )
      || (last === false && window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight )
      || last
      || 
      isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};
const useInfiniteScrollContainer = (callback,target) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if(target.current)target.current.addEventListener('scroll', handleScroll);
    return () => {if(target.current)target.current.removeEventListener('scroll', handleScroll)};
  },[target,target.current]);

  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
      console.log('called back');
    });
  }, [isFetching,callback]);

  function handleScroll() {
    if (target.current.offsetHeight + target.current.scrollTop !== target.current.scrollHeight 
      || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};


export { useInfiniteScroll, useInfiniteScrollContainer };