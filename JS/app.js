

const fetchAPI = async (url)=>{

    try{
     isLoading(true)
    const response = await fetch(url);
    const data = await response.json();

    // console.log('FETCH API: ', data);
    return data;

    }
    catch(err){
        console.error(err);
    }
}



const navCategories = async ()=>{

    const data = await fetchAPI('https://openapi.programming-hero.com/api/news/categories');
    await trendingNews('08', 'All News');

    const showAllCategories = document.getElementById('show-all-categories');

    // console.log('Load API:', data.data.news_category);

    for( const category of data.data.news_category ){
        
        const categories = document.createElement('button');
        categories.classList.add('btn');
        categories.style.color='#e6324b';
        categories.style.fontWeight='500';
        categories.onclick =()=> trendingNews(category.category_id, category.category_name );
        categories.innerText=category.category_name;
        showAllCategories.appendChild(categories);
        
    }
}


// Display Trending News
const trendingNews = async (id, category_name)=>{

    const showTrendNews = document.getElementById('trending-news');
    showTrendNews.innerHTML=``;

    const data = await fetchAPI(`https://openapi.programming-hero.com/api/news/category/${id}`);

    document.getElementById('today-title').innerText = category_name;
    
    if(!data.status){
        document.getElementById('no-data').innerText = 'No News Found';
    }
    else{
        document.getElementById('no-data').innerText = '';
    }

    let preTitle='';

    for(let news of data.data ){

        if(news.others_info.is_trending===true && preTitle!=news.title){
            
            // console.log('inner', news.others_info.is_trending);
            preTitle = news.title;
            
            
            const div = document.createElement('div');
            // console.log(div)
                div.classList.add('col-12')
                div.innerHTML = `
                <img style="height:10rem; object-fit: cover; " class="img-thumbnails w-100 rounded" src="${news.image_url}" alt="">
                <h5 onclick="modalDetails('${news._id}')" data-bs-toggle="modal" data-bs-target="#showModalDetails"  >${news.title}</h5>
                <p style="font-size: .6rem;" class="text-secondary">2022-08-25 03:09:16 - ${news.author.name} </p>
                `;
                showTrendNews.appendChild(div);
        }
        
    };

    headlineNews(data);
    latestNews(data);

    isLoading(false);
}

// Check Category
const checkCategory = async (id)=>{

    const data = await fetchAPI('https://openapi.programming-hero.com/api/news/categories');
    const category = data.data.news_category;
    return category.map(val=> val.category_id==id? val.category_name: '' ).join('');
}


// Show Headline
const headlineNews = async (data)=>{
    
    isLoading(true)

    const headlineComponent = document.getElementById('headlines');
    headlineComponent.innerHTML=``;

    const headline = data.data;
    
    for( const today of headline ){
        
        if(today.others_info.is_todays_pick===true){
            // console.log(today._id);
            const headlineCategory = await checkCategory(today?.category_id);

            const d = new Date(today.author.published_date);
            const date = timeSince(d);
            
            headlineComponent.innerHTML = `
            
                        <div style="height: 30rem; background-image: linear-gradient(rgba(0, 0, 0, 0.186),rgba(0, 0, 0, 0.852)), url('${today.image_url}'); background-size: cover; back " class="rounded d-flex align-items-end">
        
                        <div class="d-flex flex-column align-items-start text-light px-md-5 ps-3 py-3">
                        <h3 onclick="modalDetails('${today._id}')" data-bs-toggle="modal" data-bs-target="#showModalDetails"  style="line-height: 2.5rem;" > ${today.title} </h3>
                        <p class="mt-3"> ${date} - ${today.author.name} </p>
                        </div>
                        </div>
                        
                        <div class="d-flex justify-content-between p-md-4 p-2">
                        <h5 class="py-2 px-3 bg-primary text-light rounded"> ${headlineCategory} </h5>
                        <div class="">
                        <button class="btn"><i class="fa-regular fa-eye"></i> ${today.total_view}</button>
                        <button class="btn"><i class="fa-regular fa-message"></i> 50</button>
                        <button class="btn"><i class="fa-solid fa-share-nodes"></i> 3</button>
                        </div>
                        </div>
                        `;
                        return 0;
            }
    }


            const latest = headline[headline.length-1];

            // console.log(latest)
                
            const headlineCategory = await checkCategory(latest.category_id);

            
            // console.log(latest.category_id)
            
            const d = new Date(latest.author.published_date);
            const date = timeSince(d);
    
            headlineComponent.innerHTML = `
        
                        <div style="height: 30rem; background-image: linear-gradient(rgba(0, 0, 0, 0.186),rgba(0, 0, 0, 0.852)), url('${latest.image_url}'); background-size: cover; back " class="rounded d-flex align-items-end">
        
                            <div class="d-flex flex-column align-items-start text-light px-5 py-3">
                              <h3 onclick="modalDetails('${latest._id}')" data-bs-toggle="modal" data-bs-target="#showModalDetails"  style="line-height: 2.5rem;" > ${latest.title} </h3>
                              <p class="mt-3"> ${date} - ${latest.author.name} </p>
                            </div>
                        </div>
        
                        <div class="d-flex justify-content-between p-4">
                            <h5 class="py-2 px-3 bg-primary text-light rounded"> ${headlineCategory} </h5>
                            <div class="">
                                <button class="btn"><i class="fa-regular fa-eye"></i> ${latest?.total_view}</button>
                                <button class="btn"><i class="fa-regular fa-message"></i> 50</button>
                                <button class="btn"><i class="fa-solid fa-share-nodes"></i> 3</button>
                            </div>
                        </div>
            `;
        isLoading(false);
}

// Latest News

const latestNews = async (data) =>{
    

    isLoading(true)

    // console.log(data)
    const latestNewsContainer = document.getElementById('latest-news');
    latestNewsContainer.innerHTML=``;

    let preTitle='';
    
    for(const lastest of data.data){
    
        
        if(preTitle!=lastest.title){
            
        preTitle = lastest.title;

        const div = document.createElement('div');
        div.classList.add('col');

        // console.log(lastest.details.slice(0,200));

        const { image_url, title, details, author, total_view, _id } = lastest;

        // console.log(image_url)

        div.innerHTML=`
        <div class="card">
            <img src="${image_url}" class="img-fluid card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title"> ${title} </h5>

            <p> ${details.slice(0,150)}... </p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted">${timeSince(new Date(author.published_date))}</small>
                    -
                    <small class="text-muted">${author.name?author.name:'Not Found'}</small>
                    -
                    <small class="text-muted"><i class="fa-regular fa-eye"></i> ${total_view?total_view:0}</small>

                </div>
                    
                    <button onclick="modalDetails('${_id}')" style="padding:2px 10px" data-bs-toggle="modal" data-bs-target="#showModalDetails" class="btn btn-outline-danger">Details</button>
            </div>

        </div>
        `;

        latestNewsContainer.appendChild(div);
    }
}

isLoading(false)

}


// API data Loading for modal
function isLoading (isLoad){
    

    const Load = document.getElementById('isLoading');
    const category = document.getElementById('show-all-categories');
    const main = document.getElementById('main-content');


    if(isLoad){
        Load.classList.remove('d-none');
        category.classList.add('d-none');
        main.classList.add('d-none');
    }
    else{
        Load.classList.add('d-none');
        category.classList.remove('d-none');
        main.classList.remove('d-none');
    }
}

// Time Since
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }


  // API data Loading for modal
function isLoadingModal (isLoad){
    

    const modalLoad = document.getElementById('isModalLoading');
    const modalHead = document.getElementById('modal-head');
    const modalDetails = document.getElementById('news-details');

    if(isLoad){
        modalLoad.classList.remove('d-none');
        modalHead.classList.add('d-none');
        modalDetails.classList.add('d-none');
    }
    else{
        modalLoad.classList.add('d-none');
        modalHead.classList.remove('d-none');
        modalDetails.classList.remove('d-none');
    }
}

  
// Show Modal Details
async function modalDetails(id){

    console.log(id)

    isLoadingModal(true);

    const url = `https://openapi.programming-hero.com/api/news/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    const news = data.data[0];
    const { image_url, title, details, author, total_view, rating } = news;

    
    
    
    document.getElementById('showModalDetailsLabel').innerText =title ;
    
    const newsDetails = document.getElementById('news-details');
    
    
    newsDetails.innerHTML=`
    
    <div class="pb-3 col">
        <div class="d-flex flex-md-row flex-column justify-content-between">
                <img style="height: 20rem;" class="img-fluid rounded" src="${image_url}" alt="News Image">
                
                <div class="w-100 p-2">
                    <ul style="list-style:none; height:100%" class="d-flex flex-column justify-content-around">
                    <li> Author: ${author?.name} </li>
                    <li> Total Views: ${news?.total_view} </li>
                    <li> Published: ${author.published_date} </li>
                    <li> Rating: ${rating?.number} </li>
                    <li> badge: ${rating?.badge} </li>
                    </ul>
                </div>
        </div>
    </div>

    <div class="row modal-div">
        <div style="background-color: #ffdcc7; border: 1px solid #e6324b;" class="col p-3 rounded">
            <h6>${details}</h6>
        </div>
    </div>
     `;
    isLoadingModal(false)
    
    console.log(newsDetails)
}




navCategories();

{/* <div class="mt-3 d-flex flex-column gap-2">
<div class="price-btn bg-success">
<p class="plans"> ${ai.pricing==null? 'Free of Cost' : ai.pricing[0].price? (ai.pricing[0].price!=0? 'Basic - ' + ai.pricing[0].price : "Free of cost") : 'Free of cost' }  </p>
</div>
<div class="price-btn bg-warning">
<p class="plans"> ${ai.pricing==null? 'Free of Cost' :  ai.pricing[1].price? (ai.pricing[1].price!=0? 'Pro - '+ ai.pricing[1].price : "Free of cost") : 'Free of cost' }  </p>
</div>
<div class="price-btn bg-danger">
<p class="plans"> ${ai.pricing==null? 'Free of Cost' :  ai.pricing[2].price? (ai.pricing[2].price!=0? 'Enterprise - '+ ai.pricing[2].price : "Free of cost") : 'Free of cost' }  </p>
  
</div> */}