import React,{useState, useEffect, useRef,useCallback} from "react";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import Modal from "react-bootstrap/Modal";
import classnames from "classnames";
import { NavLink } from "react-router-dom";

import LazyImage from "../components/LazyImage";
import { http } from "../services/api";
import { imgixUrl } from "../../../../lib/imgixUrl";
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import "../slick.css";

const logoUrl = toAbsoluteUrl("/media/logos/logo-mini-sm.png");
const imgUrl1 = toAbsoluteUrl("/media/media/1.png");
const imgUrl2 = toAbsoluteUrl("/media/media/2.png");
const imgUrl3 = toAbsoluteUrl("/media/media/3.png");
const imgUrl4 = toAbsoluteUrl("/media/media/4.png");
const imgUrl5 = toAbsoluteUrl("/media/media/5.png");
const imgUrl6 = toAbsoluteUrl("/media/media/6.png");
const imgUrl7 = toAbsoluteUrl("/media/media/7.png");
const imgUrl8 = toAbsoluteUrl("/media/media/8.png");
const imgUrl9 = toAbsoluteUrl("/media/media/9.png");
const imgUrl10 = toAbsoluteUrl("/media/media/10.png");
const imgUrl11 = toAbsoluteUrl("/media/media/11.png");
const imgUrl12 = toAbsoluteUrl("/media/media/12.png");
const samplePhotos = [
  {
    media_url:imgUrl1,
    thumbnail_url:imgUrl1,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-03-21",
    like_count:13,
  },
  {
    media_url:imgUrl2,
    thumbnail_url:imgUrl2,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2019-03-21",
    like_count:3,
  },
  {
    media_url:imgUrl3,
    thumbnail_url:imgUrl3,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2020-03-21",
    like_count:3,
  },
  {
    media_url:imgUrl4,
    thumbnail_url:imgUrl4,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-03-24",
    like_count:63,
  },
  {
    media_url:imgUrl5,
    thumbnail_url:imgUrl5,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-03-25",
    like_count:3,
  },
  {
    media_url:imgUrl6,
    thumbnail_url:imgUrl6,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-09-21",
    like_count:3,
  },
  {
    media_url:imgUrl7,
    thumbnail_url:imgUrl7,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-08-21",
    like_count:3,
  },
  {
    media_url:imgUrl8,
    thumbnail_url:imgUrl8,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-07-21",
    like_count:23,
  },
  {
    media_url:imgUrl9,
    thumbnail_url:imgUrl9,
    caption:`afdasdf
    fasdfsdaf
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-06-21",
    like_count:31,
  },
  {
    media_url:imgUrl10,
    thumbnail_url:imgUrl10,
    caption:`afdasdf
    fasdfsdaf
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    fsadfsda
    fsdfsadfasdfsa`,
    timestamp:"2018-05-21",
    like_count:3,
  },
  {
    media_url:imgUrl11,
    thumbnail_url:imgUrl11,
    caption:`Super simple to set up.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.
    Display photos from multiple Instagram accounts in the same feed or in separate feeds`,
    timestamp:"2018-04-21",
    like_count:8,
  },
  {
    media_url:imgUrl12,
    thumbnail_url:imgUrl12,
    caption:`Display Instagram posts from your Instagram accounts, 
    either in the same single feed or in multiple different ones.`,
    timestamp:"2018-03-21",
    like_count:3,
  },
];
const carouselSettingsSm = {
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  pauseOnHover: false,
  centerMode: true,

  responsive: [
    {
      breakpoint: 599,
      settings: {
        slidesToShow: 2
      }
    }
  ]
};

const carouselSettingsLg = {
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 2000,
  slidesToShow: 3,
  slidesToScroll: 1,
  pauseOnHover: false,

  responsive: [
    {
      breakpoint: 1799,
      settings: {
        slidesToShow: 2
      }
    }
  ]
};
const sliderSettings = {
  arrows:true,
  autoplay: false,
  slidesToShow: 1,
  slidesToScroll: 1,
}
const SlideSm = ({ photo1, photo2, alt, handleClick }) => (
  <div className={"carouselSlideSm"}>
    <LazyImage src={(photo1.thumbnail_url?photo1.thumbnail_url:photo1.media_url)} alt={alt} width={462} onClick={()=>handleClick(photo1)}/>
    <LazyImage src={(photo2.thumbnail_url?photo2.thumbnail_url:photo2.media_url)} alt={alt} width={462} onClick={()=>handleClick(photo1)}/>
  </div>
);

const SlideLg = ({ photo1, photo2, photo3, alt,handleClick }) => (
  <div className={"carouselSlideLg"}>
    <div>
      <LazyImage src={(photo1.thumbnail_url?photo1.thumbnail_url:photo1.media_url)} alt={alt} width={462} onClick={()=>handleClick(photo1)}/>
      <LazyImage src={(photo2.thumbnail_url?photo2.thumbnail_url:photo2.media_url)} alt={alt} width={462} onClick={()=>handleClick(photo2)}/>
    </div>
    <div>
      <LazyImage src={(photo3.thumbnail_url?photo3.thumbnail_url:photo3.media_url)} alt={alt} width={940} onClick={()=>handleClick(photo3)}/>
    </div>
  </div>
);

const SectionInstagram = () => {
  const accessToken = "IGQVJXc19MVGhraEVHMlF0VDNOZAmIzM0FaWVI5cjhRNm0zSXBKVVRGQ1FFUjdNZAGxWVHZAxczktM203cGRlRXlKaFdHQlVNeHR1RG9XeGU2SEYzLVVZAQ05fa2xrR04wR0oxVVQ2bXFYazBSN3l3QklERwZDZD";
  const userId = "17841400220356206";
  const [photos, setPhotos] = useState(null);
  const [next, setNext] = useState(false);
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef();
  useEffect(() => {
    fetchPhotos();
  }, []);
  const fetchPhotos = async ()=>{
    setLoading(true);
    const res = await http({
      path:false,
      httpUrl: next?next:`https://graph.instagram.com/${userId}/media?fields=media_url,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children{media_url,id,media_type,timestamp,permalink,thumbnail_url}&limit=12&access_token=${accessToken}`,
      //httpUrl:`https://api.instagram.com/v1/users/search?access_token=${accessToken}&q=fitemoslatam`,
    });
    if(res.data){      
      if(res.data.paging.next){
        setNext(res.data.paging.next);
        setLoading(false);
      }
      else {
        setNext(null);
      }
      if(photos == null) setPhotos(res.data.data);
      else{
        let clonedPhotos = photos.concat(res.data.data);
        setPhotos(clonedPhotos);
        setLoading(false);
      }
  
    }
  }
  /*const fetchPhotos = ()=>{
    if(photos == null) setPhotos(samplePhotos);
    else{
      setLoading(true);
      setTimeout(()=>{
        let clonedPhotos = photos.concat(samplePhotos);
        setPhotos(clonedPhotos);
        setLoading(false);
      },1000);
    }
  };*/
  const handleClick = (photo)=>{
    const index = photos.indexOf(photo);
    setShow(true);
    setHidden(false);
    setTimeout(()=>{
      if(sliderRef.current)sliderRef.current.slickGoTo(index);
      setHidden(true);
    },5);
  }
  const handleHide = ()=>{
    setShow(false);
  }
  return (
    <section id="section-instagram" className={"instagram pt-5"}>
      <div>
        <div>
          <div className={"header container"}>
            <h2>
              Únete a la gran comunidad Fitemos y disfruta de una vida{" "}
              <span style={{ color: "#156376" }}>saludable.</span>
            </h2>
          </div>
          {photos&&(
            <>
              <div className={"contentSm"}>
                <Slider {...carouselSettingsSm}>
                  <SlideSm photo1={photos[0]} photo2={photos[1]} alt="Slide 1" handleClick={handleClick}/>
                  <SlideSm photo1={photos[2]} photo2={photos[3]} alt="Slide 2" handleClick={handleClick}/>
                  <SlideSm photo1={photos[4]} photo2={photos[5]} alt="Slide 3" handleClick={handleClick}/>
                  <SlideSm photo1={photos[6]} photo2={photos[7]} alt="Slide 4" handleClick={handleClick}/>
                  <SlideSm photo1={photos[8]} photo2={photos[9]} alt="Slide 5" handleClick={handleClick}/>
                  <SlideSm photo1={photos[10]} photo2={photos[11]} alt="Slide 6" handleClick={handleClick}/>
                </Slider>
              </div>

              <div className={"contentLg"}>
                <Slider {...carouselSettingsLg}>
                  <SlideLg 
                    photo1={photos[0]} 
                    photo2={photos[1]} 
                    photo3={photos[2]} 
                    alt="Slide 1" 
                    handleClick={handleClick}
                  />
                  <SlideLg 
                    photo1={photos[3]} 
                    photo2={photos[4]} 
                    photo3={photos[5]} 
                    alt="Slide 2" 
                    handleClick={handleClick}
                  />
                  <SlideLg 
                    photo1={photos[6]} 
                    photo2={photos[7]} 
                    photo3={photos[8]} 
                    alt="Slide 3" 
                    handleClick={handleClick}
                  />
                  <SlideLg
                    photo1={photos[9]} 
                    photo2={photos[10]} 
                    photo3={photos[11]} 
                    alt="Slide 4"
                    handleClick={handleClick}
                  />
                </Slider>
              </div>
            </>
          )}
        </div>
        <div className="community-btn">
          <NavLink to="/signup" className={"btn btn-md btn-primary fs-btn"} exact>
            COMENZAR
          </NavLink>
        </div>
      </div>
      <Modal
        size="lg"
        show={show}
        onHide={handleHide}
        animation={false}
        className="instagram-modal"
        centered
      >
        <Modal.Body>
          <Slider ref={sliderRef} {...sliderSettings}>
            {photos&&photos.map( (photo, index)=>(
              <div className={classnames("row ",{'image-hidden':hidden})} key={index}>
                <div className={classnames("col-md-7 ")}>
                  <LazyImage src={(photo.thumbnail_url?photo.thumbnail_url:photo.media_url)} alt="afdsf" width={500}/>
                </div>
                <div className="col-md-5 caption">
                  <div className="header">
                    <img src={logoUrl} width="30" alt="fitemos" />
                    fitemoslatam
                  </div>
                  <div className="sub-header">{index+1}/{photos.length} &nbsp;&nbsp;&nbsp;<i className="fab fa-instagram"></i> instagram</div>
                  <div className="description">{photo.caption}</div>
                  <div className="caption-footer">
                    <div className="like"><i className="far fa-heart"></i>{photo.like_count}</div>
                    <div className="post-date">{photo.timestamp}</div>
                  </div>
                </div>
              </div>
              ))}
          </Slider>  
        </Modal.Body>
      </Modal>
    </section>
)};

export default SectionInstagram;
