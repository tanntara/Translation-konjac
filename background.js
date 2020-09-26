/*
メニューアイテム生成時の処理
*/
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

/*
メニューアイテム削除時の処理
*/
function onRemoved() {
    console.log("Item removed successfully");
}

/*
エラー時の処理
*/
function onError(error) {
    console.log(`Error: ${error}`);
}

/*
メニューアイテム作成
*/
// 選択範囲翻訳
browser.menus.create({
    id: "translation-selection",
    title: browser.i18n.getMessage("menuItemTranslationSelection"),
    contexts: ["selection"],
}, onCreated);

// ページ翻訳
browser.menus.create({
    id: "translation-page",
    title: browser.i18n.getMessage("menuItemTranslationPage"),
    contexts: ["all"],
}, onCreated);

/*
タブを開く
*/
function OpenTranslationText(url, index) {   
    browser.tabs.create({
        "url" :  url,
        "active" : true,
        "index" : index
    }).then(function(value) {
    // 非同期処理が成功した場合
        console.log('実行結果:' + value); // => 実行結果:成功!
    }).catch(function(value) {
        // 非同期処理が失敗した場合
        console.log('実行結果:' + value); // 呼ばれない
    });
}

/*
Google翻訳のURLを生成
*/
function CreateTranslationURL(text = null, targetUrl = null){
    var isTextTranslate = text != null;
    
    // URL生成
    var url = "https://translate.google.co.jp/";
    if (!isTextTranslate){
        // ページ翻訳の場合
        url += "translate";
    }
    
    // 共通部クエリ生成
    var query = "?";
    query += "sl=auto";                               //  翻訳元言語　：　自動検出
    query += "&tl=ja";                                   //  翻訳先言語　：　日本語
    
    // テキスト翻訳orページ翻訳で固有のクエリ
    if(isTextTranslate){
        query += "&op=translate";                          // テキスト翻訳
        query += "&text=" + text;                       //  翻訳対象テキスト
    }else{
        query += "&u=" + encodeURI(targetUrl);
    }
    url += query;
    
    return url;
}

/*
メニュアイテムクリックイベント
*/
browser.menus.onClicked.addListener((info, tab) => {
    var url = "";
    switch (info.menuItemId) {
        case "translation-selection":
            url = CreateTranslationURL(info.selectionText, null);
            break;
        case "translation-page":            
            url = CreateTranslationURL(null, info.pageUrl );
            break;
    }
    OpenTranslationText(url, tab.index + 1);             // 直後のタブに生成
});
