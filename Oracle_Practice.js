var c_index = 0;
var q_index = 0;
var q_list = [];

function Question(content, explain = ""){
    this.content = content;
    this.explain = explain;
    this.choice = [];
    this.answer = 0;
    this.order = Math.random();
};

function Choice(content, answer){
    this.content = content;
    this.answer = answer;
    this.order = Math.random();
};

Question.prototype.setChoice = function(choice, answer){
    this.choice.push(new Choice(choice, answer));
};

Question.prototype.setAnswer = function(answer){
    this.answer = answer;
};

function nextScene(){
    if(q_index >= q_list.length){
        alert('すべての問題が終了しました。\n再度テストを行う場合は、ブラウザを再読み込みしてください。');
        return;
    }
    if(c_index == 0){
	    document.getElementById('pos').textContent = (q_index + 1) + '/' + q_list.length + ' 問';
        showQuestion();
    } else {
        if(c_index >= q_list[q_index].choice.length){
            showAnswer();
        } else {
            pushAnswer();
        }
    }
};

function showQuestion(){
    scene = 'answer';
    document.getElementById('question').value = q_list[q_index].content;
    for(var i = 0; i < 7; i ++){
        document.getElementById('answer_' + i).value = '';
        document.getElementById('answer_' + i).style.background = '#ffffff';
    }
    document.getElementById('answer_0').value = q_list[q_index].choice[0].content;
    document.getElementById('explain').textContent = '';
    c_index = 1;
};

function pushAnswer(){
    document.getElementById('answer_' + c_index).value = q_list[q_index].choice[c_index].content;
    c_index ++;
};

function showAnswer(){
    scene = 'question';
    for(var i = 0; i < 7; i ++){
        if(i < q_list[q_index].choice.length){
            if(q_list[q_index].choice[i].answer){
                document.getElementById('answer_' + i).style.background = '#ccffcc';
            } else {
                document.getElementById('answer_' + i).style.background = '#ffcccc';
            }
            textContent = '・' + q_list[q_index].choice[i].content;
        }
    }
    document.getElementById('explain').textContent = q_list[q_index].explain;
    c_index = 0;
    q_index ++;
};

function pushChoice(choice, answer){
    q_list[q_list.length - 1].setChoice(choice, answer);
};

function sortChoice(){
    q_list[q_list.length - 1].choice.sort(function(a, b){
        return a.order - b.order;
    });
};

function sortQuestion(){
    q_list.sort(function(a, b){
        return a.order - b.order;
    });
};

//問題作成
(function(){
    // 001
    q_list.push(new Question('データベースをARCHIVELOGモードで稼働しています。'
    + '\n\nALTER TABLESPACE 表領域名 BEGIN BACKUP;'
    + '\n\nを発行した場合の正しい説明は、次のうちどれか選びなさい。',
    'バックアップのときにロックされるのはファイルヘッダでありブロックヘッダではありません。'
    + '\nオンラインのままバックアップ可能にするモードがバックアップモードです。'
    + '\n一時表領域のファイルはそもそもオンラインでバックアップをする必要がありません。'));
    pushChoice('表領域がバックアップモードの時は追加のREDOログが生成される', true);
    pushChoice('バックアップモードの表領域は各DBブロックヘッダが固定される', false);
    pushChoice('バックアップモードの表領域は、データファイルがオフラインになりコピーに備える', false);
    pushChoice('一時表領域のバックアップには、BEGIN バックアップコマンドは必要ない', false);
    sortChoice();

    // 002
    q_list.push(new Question('SYSAUX表領域がクラッシュしました。'
    + '\nデータベースはARCHIVELOGモードで稼働しており、SYSAUX表領域のデータファイルは、ユーザー管理のバックアップが行われています。'
    + '\n次の（1）～（9）を最も素早く復旧できる手順にしたものを選びなさい。'
    + '\n（1） SYSAUX表領域をオフラインにする'
    + '\n（2） インスタンスを停止する'
    + '\n（3） SYSAUX表領域をリストアする'
    + '\n（4） SYSAUX表領域とSYSTEM表領域をリストアする'
    + '\n（5） インスタンスをマウント状態にする'
    + '\n（6） SYSAUX表領域をリカバリする'
    + '\n（7） SYSAUX表領域とSYSTEM表領域をリカバリする'
    + '\n（8） SYSAUX表領域をオンラインにする'
    + '\n（9） データベースをオープンにする',
    'SYSTEM表領域か、UNDO表領域が壊れた場合は、インスタンスを停止する必要がありますが、今回はその必要がありません。'
    + '\nまた復旧対象の表領域もSYSAUXのみで大丈夫です。'));
    pushChoice('（1） → （3） → （7） → （8） → （9）', false);
    pushChoice('（2） → （3） → （5） → （9） → （8）', false);
    pushChoice('（2） → （4） → （5） → （7） → （9）', false);
    pushChoice('（1） → （3） → （6） → （8）', true);
    sortChoice();

    // 003
    q_list.push(new Question('カレントのREDOログが全滅したため、不完全リカバリを行う必要がある。'
    + '\nどのユーザー管理不完全リカバリを選ぶべきか。',
    'カレントのREDOログ損失の不完全リカバリはREDOログ単位で復旧ポイントを決定する「ログ順序ベース」か「取り消しベース」を選びます。'
    + '\n両者とも同等の作業ですが、問題文中にユーザー管理と指定されていますので「取り消しベース」が正解です。'));
    pushChoice('ログ順序ベース', false);
    pushChoice('時間ベース', false);
    pushChoice('取り消しベース', true);
    pushChoice('変更ベース', false);
    sortChoice();

    // 004
    q_list.push(new Question('※アーカイブ先は次のとおり設定しています。'
    + '\n\nLOG_ARCHIVE_DEST_1="LOCATION=/u02/archive1"'
    + '\nLOG_ARCHIVE_DEST_2="LOCATION=/u02/archive2  MANDATORY"'
    + '\nLOG_ARCHIVE_DEST_3="LOCATION=/u03/archive3"'
    + '\nLOG_ARCHIVE_MIN_SUCCEED_DEST=2'
    + '\n\n正しい説明をすべて選択しなさい。',
    'MANDATORYが指定されているアーカイブ先に対しては、アーカイブは必須です。'
    + '\nよって、「/u02/archive2に対するアーカイブは必須である」は正しいです。'
    + '\nまた、LOG_ARCHIVE_MIN_SUCCEED_DESTが2となっているため、/u02/archive2以外のいずれか1カ所に対してアーカイブが必須となります。 '
    + '\nよって「/u02/archive2以外のいずれか1カ所に対するアーカイブが必須である」は正しいです。'));
    pushChoice('/u02/archive1および/u03/archive3に対するアーカイブは必須である', false);
    pushChoice('/u02/archive2に対するアーカイブは必須である', true);
    pushChoice('いずれか2カ所のアーカイブができればよい', false);
    pushChoice('/u02/archive2以外のいずれか1カ所に対するアーカイブが必須である', true);
    sortChoice();

    // 005
    q_list.push(new Question('フラッシュリカバリ領域の構成をすることになりました。正しいものを2つ選択しなさい',
    'DB_RECOVERY_FILE_DESTはフラッシュリカバリ領域の場所、DB_RECOVERY_FILE_DEST_SIZEはフラッシュリカバリ領域のサイズを指定します。'
    + '\nこの2つのパラメータは動的パラメータであるため、いずれの設定もデータベースの再起動は必要ありません。'
    + '\nもし、停止に時間がかかるのであれば、NORMALやTRANSACTIONALによる停止が原因であると予想できます。'
    + '\nなるべく早く再起動を行いたい場合は、IMMEDIATEを選択すべきでしょう。'
    + '\nただし、終了していないトランザクションは強制的にロールバックされるため、処理途中の変更は取り消されます。'));
    pushChoice('DB_RECOVERY_FILE_DESTでフラッシュリカバリ領域を設定する。この変更はデータベースの再起動が必要である', false);
    pushChoice('DB_RECOVERY_FILE_DESTでフラッシュリカバリ領域を設定する。この変更はデータベースの再起動は必要ない', true);
    pushChoice('DB_RECOVERY_FILE_DEST_SIZEでフラッシュリカバリのサイズを設定する。この変更はデータベースの再起動が必要である', false);
    pushChoice('DB_RECOVERY_FILE_DEST_SIZEでフラッシュリカバリのサイズを設定する。この変更はデータベースの再起動は必要ない', true);
    sortChoice();

    // 006
    q_list.push(new Question('RMAN>CONFIGURE RETENTION POLICY TO REDUNDANCY 3;'
    + '\nRMAN>CONFIGURE BACKUP OPTIMIZATION ON;'
    + '\n\ncontents表領域は、読み取り専用表領域です。'
    + '\n取得されるバックアップの数はいくつでしょうか？',
    '問題では、バックアップ最適化が構成されているため、読み取り専用表領域のバックアップは、すでに取得済みのバックアップがあればスキップされます。'
    + '\nただし、バックアップ最適化のスキップ用件には保存ポリシーも影響します。'
    + '\nこの場合、冗長数＋1のバックアップが保持され、その後スキップ対象となります。'
    + '\nよって、「4つのバックアップが保持される」が正解です。'));
    pushChoice('1', false);
    pushChoice('2', false);
    pushChoice('3', false);
    pushChoice('4', true);
    pushChoice('バックアップを取得した数分', false);
    sortChoice();

    // 007
    q_list.push(new Question('RMAN>CONFIGURE DEVICE TYPE DISK PARALLELISM 2 BACKUP TYPE TO BACKUPSET;'
    + '\nRMAN> RUN{'
    + '\n2> allocate channel c1 device type disk;'
    + '\n3> backup database;'
    + '\n4> }'
    + '\n\n上記を実行した場合、起動するチャネルの数はいくつでしょうか？'
    + '\n正しいものを選びなさい。',
    '問題の構成では、自動チャネル割り当てにて、並列性2が構成されています。'
    + '\nこれは、「PARALLELISM 2」という点で分かります。'
    + '\nそして、手動チャネル割り当てで1つのチャネルを割り当てデータベース全体のバックアップを取得しています。'
    + '\nこの場合、手動チャネル割り当てが優先的に動作するため、1つの手動チャネルが起動します。'
    + '\nよって、「手動チャネルが優先的である。よって、手動チャネルが1つ起動する」が正解です。'
    + '\nなお、手動チャネルと自動チャネルが両方起動することはありません。'
    + '\nまた、エラーになることもありません。'));
    pushChoice('自動チャネルが優先的である。よって、自動チャネルが2つ起動する', false);
    pushChoice('手動チャネルが優先的である。よって、手動チャネルが1つ起動する', true);
    pushChoice('自動チャネルが2つ、手動チャネルが1つ起動される。よって計3つのチャネルが起動する', false);
    pushChoice('自動チャネルが構成されているにもかかわらず、手動チャネル割り当てをしているためエラーになる', false);
    sortChoice();

    // 008
    q_list.push(new Question('制御ファイルの自動バックアップに関する説明として正しいものをすべて選択しなさい。',
    '制御ファイルの自動バックアップを有効化すると、バックアップ時および物理構造変更時にバックアップが自動的に取得されます。'
    + '\nなお、初期化パラメータを変更してもバックアップは取得されません。'
    + '\nまた、バックアップ対象は制御ファイルに加え、SPFILEがバックアップされます。'
    + '\nバックアップ場所を指定していない場合、フラッシュリカバリ領域に取得されます。'
    + '\nただし、フラッシュリカバリ領域の構成がない場合、$ORACLE_HOME/dbsに取得されます。'
    + '\n明示的にバックアップ場所を指定したい場合には、永続設定「CONFIGURE CONTROLFILE AUTOBACKUP FORMAT FOR DEVICE TYPE DISK TO "%F";」で設定します。'
    + '\n%Ｆの個所でディレクトリを設定します。なお、%Fは必須です。'
    + '\n例：CONFIGURE CONTROLFILE AUTOBACKUP FORMAT FOR DEVICE TYPE DISK TO "/backup/autocontrol/%F";'));
    pushChoice('1日1回決まった時間にバックアップが取得される', false);
    pushChoice('バックアップ取得時およびデータベースの物理構造変更時に、自動バックアップが取得される', true);
    pushChoice('バックアップ取得時および初期化パラメータ変更時、物理構造変更時に、自動バックアップが取得される', false);
    pushChoice('制御ファイルおよびSPFILEがバックアップされる', true);
    pushChoice('制御ファイルのみがバックアップされる', false);
    pushChoice('バックアップ場所を指定しなかった場合、$ORACLE_HOME/dbsにバックアップされる', false);
    pushChoice('バックアップ場所を指定しなかった場合、フラッシュリカバリ領域にバックアップされる', true);
    sortChoice();

    // 009
    q_list.push(new Question('制御ファイルではできない、リカバリ・カタログを使ったバックアップ管理の特徴として、正しいものをすべて選択しなさい。',
    'リカバリ・カタログには次の特徴があります。'
    + '\n\n・長期間のバックアップ保持が可能'
    + '\n・複数データベースのバックアップが一元管理できる'
    + '\n・ストアド・スクリプトを格納できる'
    + '\n\nBACKUPコマンドのKEEP FOR EVERオプションはリカバリ・カタログが必要です。'
    + '\nKEEP FOR EVERオプションを付けると、永続的にバックアップを保持できます。'
    + '\n従って、「永続的にバックアップを保持できる」は正解です。'
    + '\nリカバリ・カタログを構成した際、制御ファイルにはバックアップ情報を記録します。'
    + '\nリカバリ・カタログのリポジトリ情報は、制御ファイルにレプリケーションした情報だからです。'
    + '\nなお、RMANでは、Oracleデータベースファイルのバックアップは可能ですが、ホストファイルのバックアップはできません。'
    + '\nよって、当然リカバリ・カタログでも、ホストファイルのバックアップを保持できません。'));
    pushChoice('ストアド・スクリプトを格納できる', true);
    pushChoice('複数のデータベースおよびホストのバックアップを一元管理できる', false);
    pushChoice('永続的にバックアップを保持できる', true);
    pushChoice('制御ファイルに対してバックアップ情報を記録しなくなる', false);
    sortChoice();

    // 010
    q_list.push(new Question('リカバリ・カタログのバックアップをするための構成として、適切なものを2つ選択しなさい。',
    'リカバリ・カタログでは、障害に備えたバックアップ管理を行ってください。次の構成を推奨しています。'
    + '\n\n・ARCHIVELOGモードで運用する'
    + '\n・保存ポリシーは1より大きいREDUNDANCY値にする'
    + '\n・リカバリ・カタログをディスクとテープにバックアップする'
    + '\n・バックアップを作成するには、BACKUP DATABASE PLUS ARCHIVELOGコマンドを使用する'
    + '\n・RMANリポジトリとして、別のリカバリ・カタログではなく、制御ファイル（NOCATALOG）を使用する'
    + '\n・制御ファイルの自動バックアップをONに設定する'));
    pushChoice('ARCHIVELOGモードにし、障害発生時にはリカバリ・カタログを障害発生直前のものに復旧できるように構成する', true);
    pushChoice('NOARCHIVELOGモードにし、リソースを節約する', false);
    pushChoice('リカバリ・カタログを管理するためのリカバリ・カタログを構成し、より安全性を高くする', false);
    pushChoice('最もバックアップ管理が強化されている既存データベースに、リカバリ・カタログ用の表領域を作成。これにより、リカバリ・カタログのバックアップが簡略化されるうえ、安全性も高くなる', false);
    pushChoice('保存ポリシーをREDUNDANCY2以上に設定する', true);
    sortChoice();

    // 011
    q_list.push(new Question('仮想プライベート・カタログに関する説明として、正しくないものを2つ選択しなさい。',
    '仮想プライベート・カタログは、1つのリカバリ・カタログと複数の仮想プライベート・カタログを作成し、バックアップ管理データベースを複数のDBAで制限します。'
    + '\n複数のリカバリ・カタログを作成してもよいですが、管理負荷が増大するのでお勧めできません。'
    + '\n基本カタログとは、通常のリカバリ・カタログのことです。仮想プライベート・カタログを構成する場合、基本カタログは必須です。'));
    pushChoice('複数のリカバリ・カタログ作成し、バックアップ管理データベースを複数のDBAで制限する', true);
    pushChoice('1つのリカバリ・カタログと複数の仮想プライベート･カタログを作成し、バックアップ管理データベースを複数のDBAで制限する', false);
    pushChoice('基本カタログは必須である', false);
    pushChoice('基本カタログは任意である', true);
    sortChoice();

    // 012
    q_list.push(new Question('バックアップセットおよびイメージコピーの説明として、正しいものをすべて選択しなさい。',
    'バックアップセットの特徴は次のとおりです。'
    + '\n\n・ディスクまたはテープに、バックアップを取得できる'
    + '\n・未使用領域は圧縮される（無効化はできない）'
    + '\n\nバックアップセットの未使用領域は、必ず圧縮されます。'
    + '\nこれを無効化することはできませんし、圧縮のためのコマンドも必要ありません。'
    + '\nただし、バイナリ圧縮は別途コマンドが必要です。'
    + '\nイメージコピーの特徴は次のとおりです。'
    + '\n\n・未使用ブロックを含むすべてのブロックがバックアップ対象となる'
    + '\n・ディスクにのみ、バックアップを取得できる'));
    pushChoice('バックアップセットは、テープにのみバックアップを取得できる', false);
    pushChoice('バックアップセットは、未使用領域をコマンドにより圧縮できる', false);
    pushChoice('バックアップセットは、未使用領域が必ず圧縮される', true);
    pushChoice('イメージコピーは、ディスクまたはテープにバックアップを取得できる', false);
    pushChoice('イメージコピーは、未使用ブロックを含むすべてのブロックがバックアップ対象となる', true);
    sortChoice();

    // 013
    q_list.push(new Question('RMANを使用した圧縮バックアップについて、正しい説明をすべて選択しなさい。',
    'バックアップセットを作るとき、標準設定では圧縮アルゴリズムを使わず、ストレージ上の未使用領域を削減するだけです。'
    + '\nイメージコピーは圧縮アルゴリズムを使って圧縮することはできません。'
    + '\nZLIB圧縮アルゴリズムはBZIP2に比べてプロセッサ時間をあまり消費しませんが、バックアップ速度が常に優れていると保証されているわけではありません。'
    + '\n圧縮アルゴリズムを利用することで、入出力のデータ量が減るため入出力部分の速度が低いときにも効果を期待できます。'));
    pushChoice('BZIP2圧縮アルゴリズムは、ZLIB圧縮アルゴリズムに比べてプロセッサ時間を多く消費する', true);
    pushChoice('バックアップセットは常にBZIP2かZLIBによる圧縮が行われる', false);
    pushChoice('RMANのBACKUPコマンド、AS COMPRESSEDキーワードは、圧縮バックアップセット、ならびに圧縮イメージコピーを作成するときに使う', false);
    pushChoice('ZLIB圧縮アルゴリズムを使用することで、最高のバックアップ速度を得られる', false);
    pushChoice('使用帯域幅を抑えることと、ディスク消費を減らすことができる', true);
    sortChoice();

    // 014
    q_list.push(new Question('増分バックアップについて正しい説明をすべて選択しなさい',
    '増分バックアップでは、まずレベル0としてフラグを付けたバックアップを取る必要があります。'
    + '\nその内容は完全バックアップと同じものですが、「レベル0の増分バックアップ」と呼びます。'
    + '\n障害の復旧に当たって増分バックアップがあれば、RMANは自動的に増分バックアップを使います。'
    + '\nただし、最後の増分バックアップ以降の変更を反映させるにはアーカイブログとREDOログが必要です。'));
    pushChoice('累積増分バックアップは、完全バックアップ以降の増分データをバックアップするものである', false);
    pushChoice('差分増分バックアップは、完全バックアップ以降の増分データをバックアップするものである', false);
    pushChoice('累積増分バックアップは、レベル0バックアップ以降の増分をバックアップするものである', true);
    pushChoice('レベル0バックアップとレベル1バックアップがあっても、障害の復旧にはアーカイブログやREDOログが必要である', true);
    sortChoice();

    // 015
    q_list.push(new Question('高速増分バックアップに関する説明として正しいものをすべて選択しなさい',
    '高速増分バックアップは「ALTER DATABASE ENABLE CHANGE TRACKING」コマンドで有効になりますが、ファイルの生成場所は任意に決められます。'
    + '\n「DB_CREATE_FILE_DEST」パラメータは設定しなくても問題ありません。'
    + '\nその内容は完全バックアップと同じものですが、「レベル0の増分バックアップ」と呼びます。'
    + '\nレベル1バックアップを取得する前に有効としても、レベル0バックアップを取ってから、どのブロックに変更が加わったのかを追跡することはできません。'
    + '\nブロック変更トラッキング機能はいつでも有効にできますが、増分バックアップというものは、レベル0バックアップと比較して変わった部分のデータをバックアップするものです。'
    + '\n「ブロック変更トラッキングを有効にする」→「レベル0バックアップを取る」という手順を踏むことで、正しく前の世代のバックアップデータから変わった点を正しく認識できるということになります。'
    + '\nレベル0以降の変更点を追うのが増分バックアップの基本です。'
    + '\nそう考えると、レベル0バックアップを取ったときに、変更点の情報はリセットしなければなりません。'
    + '\nブロック変更トラッキングファイルを使うことで、バックアップ元のデータファイルへのアクセス量が減るため、処理性能が上がりますが、増分バックアップのファイルサイズは変わりません。'
    + '\nブロック変更トラッキングファイルはREDOログの生成時に更新されます。'
    + '\nただし、REDOログのサイズとの因果関係はありません。'));
    pushChoice('「DB_CREATE_FILE_DEST」パラメータを必要とする', false);
    pushChoice('レベル1バックアップを取得する前に有効にしておけば活用される', false);
    pushChoice('レベル0バックアップを取得すると、ビットがリセットされる', true);
    pushChoice('取得される増分バックアップのサイズを小さくできる可能性がある', false);
    pushChoice('変更トラッキングファイルは、CTRWによりREDOの生成時に更新される', true);
    pushChoice('ブロック変更トラッキングファイルのサイズはREDOログの容量に比例する', false);
    sortChoice();

    // 016
    q_list.push(new Question('「不要なファイル」について正しい説明を選択しなさい',
    '不要なファイルとは保存ポリシーの範囲外となってしまったファイルのことです。'
    + '\nいつでも削除して大丈夫ですが、保存ポリシーの範囲外であっても、バックアップからアーカイブ・ログが継続的に存在していれば、それらのファイルを利用して回復することが可能です。'
    + '\nCROSSCHECKは、実際のファイルとRMANリポジトリ情報の同期をチェックするコマンドです。'
    + '\n「不要なファイル」の判断には使われません。'
    + '\nまた、EXPIERDはCROSSCHECKで判断されるものですが、「不要なファイル」とは無関係です。'));
    pushChoice('不要なファイルとは、すでに回復に使うことができないバックアップやアーカイブログのことである', false);
    pushChoice('不要なファイルは、CROSSCHECKコマンドで発見できる', false);
    pushChoice('不要なファイルはDELETE OBSOLETE コマンドで削除される', true);
    pushChoice('不要なファイルは保存ポリシー期限が切れたため EXPIERD とマークされる', false);
    sortChoice();

    // 017
    q_list.push(new Question('読み取り専用表領域について正しい説明をすべて選択しなさい',
    '読み取り専用表領域と書き込み可能表領域は相互に変更できます。'
    + '\n読み取り専用表領域に変更してバックアップを取得した場合、それ以降バックアップをする必要はありませんが、複数回バックアップを取得すること自体は可能です。'
    + '\n読み取り専用表領域に変更してバックアップを取得の後、データファイルが壊れた場合、ファイルをリストアするのみで復旧できます。'
    + '\nアーカイブ・ログを使用する復旧にはなりません。'
    + '\nただし、読み取り専用表領域にしたのに、その後バックアップを取得していない場合、書き込み可能表領域の時代に獲得したバックアップと、そこからのアーカイブ・ログを使って復旧することになります。'));
    pushChoice('読み取り専用表領域にすると、書き込み可能な表領域に戻すことはできない', false);
    pushChoice('読み取り専用表領域にした後、その表領域に対して、バックアップを複数回実行することはできない', false);
    pushChoice('読み取り専用表領域に変更し、すぐにバックアップを取得した。その読み取り専用表領域が壊れてもアーカイブ・ログが必要になる', false);
    pushChoice('復旧にあたり、読み取り専用表領域に変更する以前に取得したバックアップを使うことも可能である', true);
    sortChoice();

    // 018
    q_list.push(new Question('表を誤って削除したため、RMANで不完全リカバリを実行します。'
    + '\n不完全リカバリについて正しく説明しているものをすべて選びなさい',
    '表の誤削除が原因で不完全リカバリを実行する場合、制御ファイルの再作成は必要ありません。'
    + '\nMOUNTモードでリストアし、RESETLOGSオプションでオープンする必要があります。'
    + '\n不完全リカバリでは、すべてのデータファイルをリストアする必要があります。'
    + '\n特定のファイルのみ過去の状態に戻すことはできません。'));
    pushChoice('データファイルをリストアするために、ターゲットデータベースがMOUNTモードである必要がある', true);
    pushChoice('データベースはRESETLOGSオプションを使用してオープンする必要がある', true);
    pushChoice('制御ファイルを再作成する必要がある', false);
    pushChoice('削除された表がどのデータファイルにあるか関係なく、すべてのデータファイルをリストアする必要がある', true);
    sortChoice();

    // 019
    q_list.push(new Question('下記のRMANコマンドについて正しく説明しているものを選びなさい'
    + '\n\nRUN'
    + '\n{'
    + '\nSET UNTIL SEQUENCE 1076;'
    + '\nRESTORE DATABASE;'
    + '\nRECOVER DATABASE;'
    + '\n}',
    'UNTIL SEQUENCE句は、不完全リカバリにおいてログ順序番号を指定する方法です。'
    + '\n指定した番号の1つ前までのログを適用します。'
    + '\nRMANコマンドで、回復したいポイントを決定するのは、SET UNTILコマンドです。'
    + '\nRECOVERコマンドではありません。'
    + '\nなお、RECOVERコマンドでのUNTIL句はユーザー管理と呼ばれるリカバリ方法の際に用いられます。'));
    pushChoice('SCN 1076以前にバックアップしたデータファイルをリストアして、SCN 1076までのログを適用する', false);
    pushChoice('ログ順序番号1075番までのログを使って回復する', true);
    pushChoice('ログ順序番号1076番をリストアし、リカバリする', false);
    pushChoice('復旧にあたり、読み取り専用表領域に変更する以前に取得したバックアップを使うことも可能である', false);
    sortChoice();

    // 020
    q_list.push(new Question('下記のRMANコマンドについて正しく説明しているものを選びなさい'
    + '\n\nBACKUP DATABASE TAG year2011'
    + '\nKEEP UNTIL TIME "SYSDATE+365" RESTORE POINT year2011;',
    'KEEP UNTIL句により、RMANリポジトリの保存方針に関係なく、指定した期間、保存されます。'
    + '\nSYSDATE+365とありますので、リポジトリに365日間保存されますが、期間を過ぎたとしても、バックアップが自動的に削除されるわけではありません。'
    + '\n削除対象とマークが変わるだけです。'
    + '\nリストアポイントを同時に作成することも可能ですが、リカバリポイント時点のバックアップは作成できません。'
    + '\nリカバリカタログはKEEP FOREVER句を指定するときに必要になります。'));
    pushChoice('バックアップは、構成済みの保存方針にかかわらず最低365日間保存される', true);
    pushChoice('365日後にバックアップは自動的に削除となる', false);
    pushChoice('リストアポイントyear2011が作成された時点のバックアップを取得する', false);
    pushChoice('リカバリカタログ未使用の場合このコマンドは失敗する', false);
    sortChoice();

    // 021
    q_list.push(new Question('REDOログの構成を3グループとし、各グループは二重に冗長化しています。'
    + '\nディスク障害により、1ファイルを損失してしまいました。'
    + '\nこの損失以前の状態に回復するに当たり、最適な方法を選びなさい。',
    'グループ内のメンバーが全損しない限り、バックアップを使ったリカバリは必要ありません。'
    + '\nしかし、Oracle Databaseが自動的に修復するわけでもありません。'
    + '\n回復するのは、正解の「a」を実行します。'
    + '\nインスタンスの再起動で自動的に修復できるのは「一時ファイル」です。'
    + '\nまた、このままでもシステムとしては稼働し続けますが、今回の問題は、回復する方法を尋ねているので、放置するという答えは不適切です。'));
    pushChoice('損失のあったグループにメンバーを追加し、損失のあったファイルは削除する', true);
    pushChoice('最新のバックアップを使い、壊れたログの1つ前までのログ順序リカバリを実行する', false);
    pushChoice('ファイルを自動的に修復させるため、インスタンスを再起動する', false);
    pushChoice('このままの状態でもシステムは動き続けるので、何もしないで良い', false);
    sortChoice();

    // 022
    q_list.push(new Question('オンラインREDOロググループのステータスの説明として、誤っているものを選びなさい',
    'CURRENTは、現在ログライターが書き込んでいるREDOロググループです。'
    + '\nACTIVE、INACTIVEは、アーカイブログの獲得とは無関係という点で共通しています。'
    + '\nACTIVEは、インスタンスリカバリに必要であり、INACTIVEは、その必要がなくなっているグループです。'));
    pushChoice('CURRENTのグループは、ログライターが現在書き込んでいるグループである', false);
    pushChoice('ACTIVEのグループはインスタンスリカバリに必要であり、アーカイブログが獲得されているとは限らない', false);
    pushChoice('チェックポイントが実行されると、ACTIVEのグループのステータスはINACTIVEになる', false);
    pushChoice('INACTIVEのグループはチェックポイントが実行されるまでは、インスタンスリカバリに必要だが、すでに、アーカイブログは獲得されている', true);
    sortChoice();

    // 023
    q_list.push(new Question('オンラインREDOログファイルで、同一グループ内のすべてのメンバーが損失した場合、どのようにリカバリすればよいか、2つ選びなさい',
    'INACTIVEの場合は、ログファイルの消去でリカバリが可能です。'
    + '\nただし、アーカイブされていない場合、アーカイブログの連続性が失われるので、データベース全体のバックアップを取っておく必要があります。'
    + '\nACTIVEの場合は、チェックポイントを実行することで、INACTIVEになります。'
    + '\nここからの作業はINACTIVEと同様です。'
    + '\nCURRENTの場合、ログファイルは消去できません。'
    + '\n不完全リカバリの実行で対処することになります。'));
    pushChoice('INACTIVEなグループの場合は、ログファイルの消去でリカバリできる', true);
    pushChoice('ACTIVEなグループの場合は、すでにアーカイブ・ログが獲得されていれば、チェックポイントの実行のみで対処できる', false);
    pushChoice('ACTIVEなグループの場合、アーカイブ・ログが獲得されていなくても、チェックポイントが成功すればINACTIVEステータスになるため、その後は、INACTIVEと同様の手順でリカバリできる', true);
    pushChoice('CURRENTのグループの場合、いったんインスタンスを停止し、マウント状態で、ログファイルの消去が可能である', false);
    sortChoice();

    // 024
    q_list.push(new Question('RMAN DUPLICATEコマンドでFROM ACTIVE DATABASE句を含めずデータベースを複製した。'
    + '\n結果について正しい説明を選べ。',
    'DUPLICATEコマンドを使用してデータベースを複製すると、複製データベースには新規に一意のDBIDが割り当てられます。'
    + '\n確かにRMANは既存のバックアップを使用しますが、アーカイブREDOログ・ファイルと増分バックアップも使用して不完全リカバリを実行します。'
    + '\nRMANは、複製データベースの制御ファイルも作成します。'
    + '\nオンラインREDOログ・ファイルはコピーできないため、複製先でREDOログファイルを再作成します。'));
    pushChoice('RMANは、既存のバックアップだけを使用して複製データベースを作成', false);
    pushChoice('RMANは、複製データベースの制御ファイルを作成しない', false);
    pushChoice('新規の複製データベースにオンラインREDOログがコピーされる', false);
    pushChoice('複製データベースには、新たに一意のDBIDが割り当てられる', true);
    sortChoice();

    // 025
    q_list.push(new Question('データベース全体を複製したいと考えているが、「READONLY_A」「READONLY_B」という名前の2つが読み取り専用表領域に指定されていた。'
    + '\n以下のコマンドを実行した際の正しい説明はどれか選べ。'
    + '\nなお、ファイルパスの指定は解決済みとする。'
    + '\n\nRMAN> DUPULICATE TARGET DATABASE TO dup;',
    '読み取り専用表領域だからといって、特別なことはありません。'
    + '\n読み取り専用表領域のデータ転送は行われないが、複製データベースに表領域のMETA情報は登録されるのは、SKIP READONLYオプションを追加したときの挙動です。'));
    pushChoice('データベースのデータファイルがすべて複製される', true);
    pushChoice('READONLY_AとREADONLY_Bは複製されない', false);
    pushChoice('読み取り専用表領域に関する記述がないため、失敗', false);
    pushChoice('読み取り専用表領域のデータ転送は行われないが、複製データベースに表領域のMETA情報は登録される', false);
    sortChoice();
    
    // 026
    q_list.push(new Question('インスタンスの起動時に自動的に修復される障害の種類を選択しなさい。',
    'Oracleインスタンスの異常終了に伴うデータベースの不整合　→　インスタンスリカバリ'
    + '\nデータファイルの誤削除　→　メディアリカバリ'
    + '\nSQLの構文エラー　→　SQLを手動修正'
    + '\nデータの誤更新　→　フラッシュバックテクノロジーや不完全リカバリ'));
    pushChoice('データファイルの誤削除', false);
    pushChoice('SQLの構文エラー', false);
    pushChoice('データの誤更新', false);
    pushChoice('Oracleインスタンスの異常終了に伴うデータベースの不整合', true);
    sortChoice();
    
    // 027
    q_list.push(new Question('自動チェックポイント・チューニング機能とMTTRアドバイザに関する説明として正しいものを2つ選択しなさい。',
    '自動チェックポイント・チューニング機能は、システムの負荷が低い場合に更新済みブロックをデータファイルに書き込む機能です。'
    + '\nFAST_START_MTTR_TARGETが未設定、または0以外に設定されている場合に有効になります。'
    + '\nMTTRアドバイザは、FAST_START_MTTR_TARGETを減少することでI/O量がどの程度増加するかを予測する機能、'
    + '\nまたは、FAST_START_MTTR_TARGETを増加することでI/O量がどの程度減少するかを予測する機能です。'
    + '\nMTTRアドバイザはSTATISTICS_LEVEL初期化パラメータにTYPICALまたはALLを、FAST_START_MTTR_TARGET初期化パラメータに0以外の値を設定すると有効になります。'));
    pushChoice('自動チェックポイント・チューニング機能はFAST_START_MTTR_TARGETが未設定、または0以外に設定されている場合に有効である', true);
    pushChoice('自動チェックポイント・チューニング機能は最適なFAST_START_MTTR_TARGETを自動的に決定する機能である', false);
    pushChoice('MTTRアドバイザは、STATISTICS_LEVEL初期化パラメータにTYPICALまたはALLを、FAST_START_MTTR_TARGET初期化パラメータに0を設定すると使用できる', false);
    pushChoice('MTTRアドバイザを使用すると、FAST_START_MTTR_TARGETを増加することで、I/O量がどの程度減少するかを予測できる', true);
    sortChoice();
    
    // 028
    q_list.push(new Question('メディア障害に分類されるものを2つ選択しなさい',
    'GOLD参考書3Pを参照'));
    pushChoice('誤って表を削除した', false);
    pushChoice('誤ってユーザーを削除した', false);
    pushChoice('誤ってデータファイルを削除した', true);
    pushChoice('誤って表領域を削除した', false);
    pushChoice('誤って制御ファイルを削除した', true);
    sortChoice();
    
    // 029
    q_list.push(new Question('メディア障害からの復旧作業におけるリストアの意味を正しく説明しているものを選択しなさい',
    'バックアップ取得時点から障害発生直前までに実行された更新を適用する　→　メディア障害からの復旧作業におけるリカバリ'
    + '\nバックアップからファイルを復元する　→　メディア障害からの復旧作業におけるリストア'
    + '\nインスタンス起動時にデータベースの不整合を自動的に修復する　→　インスタンスリカバリ'
    + '\nデータベース全体を過去の状態に復元する　→　フラッシュバックデータベースまたは不完全リカバリ'));
    pushChoice('バックアップ取得時点から障害発生直前までに実行された更新を適用する', false);
    pushChoice('バックアップからファイルを復元する', true);
    pushChoice('インスタンス起動時にデータベースの不整合を自動的に修復する', false);
    pushChoice('データベース全体を過去の状態に復元する', false);
    sortChoice();
    
    // 030
    q_list.push(new Question('RMANから実行できるSQL文およびコマンドをすべて選択しなさい',
    '11gまでは制限があったが、12cからはほぼすべてのSQL文が実行できる。'));
    pushChoice('ALTER DATABASE OPEN;', true);
    pushChoice('STARTUP', true)
    pushChoice('SHUTDOWN IMMEDIATE', true);
    pushChoice('SELECT * FROM V$DATABASE;', true);
    pushChoice('SELECT * FROM DBA_TABLESPACES;', true);
    sortChoice();
    
    // 031
    q_list.push(new Question('高速リカバリ領域を構成している場合、一般的に高速リカバリ領域に配置または出力されるファイルの種類を4つ選択しなさい。',
    'アラートログファイルとトレースファイルはADRに格納されます。'
    + '\nデータファイルは、通常高速リカバリ領域とは別のディスク装置の領域に配置されます。'));
    pushChoice('アーカイブログファイル', true);
    pushChoice('アラートログファイル', false);
    pushChoice('トレースファイル', false);
    pushChoice('RMANバックアップピース', true);
    pushChoice('RMANイメージコピー', true);
    pushChoice('制御ファイルの自動バックアップ', true);
    pushChoice('UNDO表領域のデータファイル', false);
    sortChoice();
    
    // 032
    q_list.push(new Question('非CDB環境におけるファイルの自動バックアップに関する説明として正しいものを選択しなさい。',
    '非CDB環境では制御ファイルの自動バックアップはデフォルトで無効です'
    + '\n以下のコマンドを実行して明示的に有効にする必要があります'
    + '\n\nCONFIGURE CONTROLFILE AUTOBACKUP ON;'
    + '\n\n制御ファイルの自動バックアップ対象は、制御ファイルとサーバーパラメータファイル(spfile)です。;'
    + '\n制御ファイルの自動バックアップはデフォルトで高速リカバリ領域に出力されます。'
    + '\n制御ファイルの自動バックアップを無効にしても、BACKUP DATABASEなどの実行時に制御ファイルのバックアップが取得されます。'));
    pushChoice('制御ファイルの自動バックアップはデフォルトで有効である', false);
    pushChoice('制御ファイルの自動バックアップのバックアップ対象は制御ファイルとテキスト形式の初期化パラメータ(pfile)である', false);
    pushChoice('デフォルトでは、制御ファイルの自動バックアップは高速リカバリ領域に出力される', true);
    pushChoice('制御ファイルの自動バックアップを無効にすると、制御ファイルのバックアップはまったく取得されなくなる', false);
    sortChoice();
    
    // 033
    q_list.push(new Question('高速リカバリ領域の場所を指定する方法で正しいものを選択しなさい',
    'GOLD参考書12Pを参照'));
    pushChoice('初期化パラメータDB_RECOVERY_FILE_DESTにディレクトリパスを設定する', true);
    pushChoice('初期化パラメータFAST_RECOVERY_AREAにディレクトリパスを設定する', false);
    pushChoice('RMANの永続設定CONFIGURE RECOVERY AREAにディレクトリパスを設定する', false);
    pushChoice('ALTER DATABASE RECOVERY AREAコマンドでディレクトリパスを設定する', false);
    sortChoice();
    
    // 034
    q_list.push(new Question('保存ポリシーに関する説明で適切なものを選択しなさい。',
    'GOLD参考書13Pを参照'));
    pushChoice('保存ポリシーの設定において、冗長性とリカバリ期間の2つの指定方法を同時に設定できる', false);
    pushChoice('高速リカバリ領域を使用していなくても、保存ポリシーの観点から不要とみなされたファイルは自動的に削除される', false);
    pushChoice('保存ポリシーの観点から不要とみなされた古いファイルには、"OLD"マークが付けられる', false);
    pushChoice('保存ポリシーの保存期間は、初期化パラメータUNDO_RETENTIONに設定する', false);
    pushChoice('冗長性を基準に保存ポリシーを設定するには、CONFIGURE RETENTION POLICY TO REDUNDANCY<冗長性>;を実行する', true);
    sortChoice();

    // 035
    q_list.push(new Question('デフォルトのバックアップ出力先デバイスを指定する方法として適切なものを選択しなさい。',
    'GOLD参考書15Pを参照'));
    pushChoice('RMANのCONFIGURE DEFAULT DEVICE TYPE TOコマンド', true);
    pushChoice('RMANのCONFIGURE CHANNEL DEVICE TYPE DISK FORMATコマンド', false);
    pushChoice('初期化パラメータ DAFAULT_DEVICE_TYPE', false);
    pushChoice('初期化パラメータ DAFAULT_DEVICE', false);
    sortChoice();
    
    // 036
    q_list.push(new Question('リカバリカタログを使用する利点として適切なものを2つ選択しなさい。',
    'GOLD参考書17Pを参照'));
    pushChoice('RMAN関連の管理情報をCONTROL_FILE_RECORD_KEEP_TIME初期化パラメータで設定した日数だけ保存できる', false);
    pushChoice('ターゲットデータベースとは別にデータベースを用意する必要がない', false);
    pushChoice('複数のターゲットデータベースを一元的に管理できる', true);
    pushChoice('同じDBIDを持つ複数のデータベースを登録できる', false);
    pushChoice('ストアドスクリプトを使用できる', true);
    sortChoice();

    // 037
    q_list.push(new Question('リカバリカタログを構成する手順として正しいものを選択しなさい。'
    + '\n\n1.リカバリカタログ所有ユーザーにRECOVERY_CATALOG_OWNERロールを付与する。'
    + '\n2.リカバリカタログ所有ユーザーにDBAロールを付与する。'
    + '\n3.リカバリカタログ用データベースを準備する。'
    + '\n4.リカバリカタログ所有ユーザーを作成する。'
    + '\n5.リカバリカタログ所有ユーザーで、CATALOGオプションを指定して、リカバリカタログ用データベースに接続する。'
    + '\n6.リカバリカタログ所有ユーザーで、SQL*Plusを使ってリカバリカタログ用データベースに接続する。'
    + '\n7.CREATE CATALOGコマンドを実行する。',
    'GOLD参考書18Pを参照'));
    pushChoice('4　→　1　→　5　→　7', false);
    pushChoice('3　→　4　→　1　→　5　→　7', true);
    pushChoice('2　→　4　→　2　→　5　→　6', false);
    pushChoice('4　→　1　→　5　→　6', false);
    sortChoice();
    
    // 038
    q_list.push(new Question('リカバリカタログへの接続に使用するCONNECTコマンドの指定として正しいものを選択しなさい。'
    + '\n\n・リカバリカタログ所有のユーザー名：rcatowner'
    + '\n・リカバリカタログ所有のユーザーのパスワード：Password123'
    + '\n・リカバリカタログ用のデータベース接続用ネットサービス名：rcat',
    'GOLD参考書18Pを参照'));
    pushChoice('CONNECT RECOVERY_CATALOG rcatowner/Password123@rcat', false);
    pushChoice('CONNECT CATALOG rcatowner/Password123@rcat', true);
    pushChoice('CONNECT TARGET rcatowner/Password123@rcat', false);
    pushChoice('CONNECT TARGET rcat/Password123@rcatowner', false);
    sortChoice();
    
    // 039
    q_list.push(new Question('リカバリカタログの運用に関する説明として正しいものを2つ選択しなさい。',
    'GOLD参考書19Pを参照'));
    pushChoice('リカバリカタログが保持するデータは失われても復元可能であるため、リカバリカタログ用データベースのバックアップを取得する必要はない', false);
    pushChoice('リカバリカタログを使用してバックアップを実行すると、RMANの管理情報が自動的に同期される', true);
    pushChoice('ターゲットデータベースとリカバリカタログの両方に接続すると、自動的にターゲットデータベースがリカバリカタログに登録される', false);
    pushChoice('リカバリカタログに登録されているデータベースごとに15MBの領域が必要である', true);
    sortChoice();
    
    // 040
    q_list.push(new Question('ストアドスクリプトに関する説明として正しいものを選択しなさい',
    'GOLD参考書20Pを参照'));
    pushChoice('テキスト形式のファイルに記載された一連のRMANコマンドをRMANクライアントが実行できる機能である', false);
    pushChoice('一連のRMANコマンドをターゲットデータベースにストアドプロシージャとしてまとめ、これをRMANクライアントから実行できる機能である', false);
    pushChoice('リカバリカタログに登録された一連のRMANコマンドをRMANクライアントから実行できる機能である', true);
    pushChoice('過去実行したRMANコマンドを再実行するための機能である', false);
    sortChoice();
    
    // 041
    q_list.push(new Question('/disk1/backupディレクトリ以下にあるバックアップセット形式のバックアップファイルをRMANリポジトリに登録する。'
    + '\nその場合に実行するコマンドとして正しいものを選択しなさい。',
    'GOLD参考書20Pを参照'));
    pushChoice('CATALOG LIKE "/disk1/backup/%";', false);
    pushChoice('CATALOG START WITH "disk1/backup/";', true);
    pushChoice('CATALOG BACKUPPIECE LIKE "disk1/backup/%";', false);
    pushChoice('CATALOG BACKUPPIECE START WITH "disk1/backup/";', false);
    sortChoice();
    
    // 042
    q_list.push(new Question('カタログのインポートに関する説明として正しいものを選択しなさい。',
    'GOLD参考書21Pを参照'));
    pushChoice('異なるバージョンのリカバリカタログ間でカタログをインポートできる', false);
    pushChoice('カタログのインポートを実行したとき、インポート先のデータベースにリカバリカタログが存在しない場合は、自動的にリカバリカタログが作成される', false);
    pushChoice('カタログのインポートにはIMPORT CATALOGコマンドを使用する', true);
    pushChoice('カタログのインポートを実行するとき、ターゲットデータベースに接続しておく必要がある', false);
    sortChoice();
    
    // 043
	q_list.push(new Question('カタログのインポートを行うときに実行するRMANコマンドの組み合わせとして正しいものを選択しなさい。'
	+ '\n'
	+ '\nインポート元のリカバリカタログ所有者：rcat1owner'
	+ '\nインポート元のリカバリカタログ用データベースのネットサービス名：rcat1'
	+ '\nインポート先のリカバリカタログ所有者：rcat2owner'
	+ '\nインポート先のリカバリカタログ用データベースのネットサービス名：rcat2',
	'GOLD参考書22Pを参照'));
	pushChoice('CONNECT CATALOG rcat1owner@rcat1　IMPORT CATALOG rcat2owner@rcat2', false);
	pushChoice('CONNECT CATALOG rcat2owner@rcat2　IMPORT CATALOG rcat1owner@rcat1', true);
	pushChoice('CONNECT TARGET rcat1owner@rcat1　IMPORT CATALOG rcat2owner@rcat2', false);
	pushChoice('CONNECT TARGET rcat2owner@rcat2　IMPORT rcat1owner@rcat1', false);
	sortChoice();
	
	// 044
    q_list.push(new Question('NOARCHIVELOGモードとARCHIVELOGモードに関する説明で、正しいものを2つ選択しなさい。',
    'NOARCHIVELOGモードでは、オフラインバックアップのみをサポートします。'
    + '\nオンラインバックアップはサポートしません。'
    + '\nよって、可用性が重要なシステムでは、NOARCHIVELOGモードの運用は不向きです。'
    + '\nARCHIVELOGモードはオンラインバックアップをサポートするため、データベースを停止せずにバックアップを取得できます。'
    + '\nそのため、可用性は高くなります。'
    + '\nただし、DataPumpなどの論理バックアップの取得により、NOARCHIVELOGモードでもオープン中のバックアップの取得は可能です。'));
    pushChoice('NOARCHIVELOGモードでは、オンラインバックアップのみをサポートする', false);
    pushChoice('ARCHIVELOGモードでは、オンラインバックアップおよびオフラインバックアップをサポートする', true);
    pushChoice('可用性が重要なシステムでは、NOARCHIVELOGモードを選択すべきである', false);
    pushChoice('可用性が重要なシステムでは、ARCHIVELOGモードを選択すべきである', true);
    sortChoice();
    
    // 045
	q_list.push(new Question('仮想プライベートカタログに関する説明として正しいものを選択しなさい。',
	'GOLD参考書22Pを参照'));
	pushChoice('複数のリカバリカタログを仮想的に統合し、一元的に管理できるようにする機能である', false);
	pushChoice('リカバリカタログに登録されたデータベースのうち、管理できるデータベースを限定するための機能である', true);
	pushChoice('リカバリカタログのストアドスクリプトを、リカバリカタログに登録されたすべてのターゲットデータベースに対して実行可能にする機能である', false);
	pushChoice('マルチテナントデータベース上に作成されたリカバリカタログである', false);
	sortChoice();
	
	// 046
	q_list.push(new Question('Oracle Database 12.1.0.1 で仮想プライベートカタログを作成する手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.仮想プライベートカタログの所有ユーザーを作成する。'
	+ '\n2.仮想プライベートカタログの所有ユーザーに管理対象データベースを管理する権限を付与する。'
	+ '\n3.仮想プライベートカタログの所有ユーザーにRECOVERY_CATALOG_OWNER権限を付与する。'
	+ '\n4.仮想プライベートカタログ専用の表領域を作成する。'
	+ '\n5.通常のリカバリカタログを作成する。'
	+ '\n6.仮想プライベートカタログを作成する。',
	'GOLD参考書23Pを参照'));
	pushChoice('1 → 3 → 2 → 4 → 6', false);
	pushChoice('5 → 1 → 3 → 2 → 4 → 6', false);
	pushChoice('1 → 3 → 2 → 6', false);
	pushChoice('5 → 1 → 3 → 2 → 6', true);
	sortChoice();
	
	// 047
	q_list.push(new Question('以下のデータベースのうち、リカバリカタログに登録できないデータベースをすべて選択しなさい。',
	'GOLD参考書24Pを参照'));
	pushChoice('NOARCHIVELOGモードのデータベース', false);
	pushChoice('ARCHIVELOGモードのデータベース', false);
	pushChoice('リカバリカタログ登録済みのデータベースをDUPLICATEコマンドで複製したデータベース', false);
	pushChoice('リカバリカタログ登録済みのデータベースのバックアップをRESTOREコマンドでリストアして作成したデータベース', true);
	pushChoice('表領域が暗号化されているデータベース', false);
	sortChoice();
	
	// 048
	q_list.push(new Question('BACKUP DATABASEコマンドを実行したときにバックアップされるファイル種別をすべて選択しなさい。',
	'GOLD参考書25Pを参照'));
	pushChoice('SYSTEM表領域のデータファイル', true);
	pushChoice('UNDO表領域のデータファイル', true);
	pushChoice('オンラインログファイル', false);
	pushChoice('制御ファイル', true);
	pushChoice('サーバーパラメータファイル', true);
	pushChoice('テキスト形式の初期化パラメータファイル', false);
	pushChoice('アラートログファイル', false);
	sortChoice();
	
	// 049
	q_list.push(new Question('以下の構成でBACKUP DATABASEを実行したときのバックアップ形式およびバックアップ出力先デバイスを選択しなさい。'
	+ '\n'
	+ '\nRMAN> SHOW ALL;'
	+ '\n'
	+ '\nリカバリカタログの代わりにターゲット・データベース制御ファイルを使用しています'
	+ '\ndb_unique_name ORCLのデータベースにおけるRMAN構成パラメータ:'
	+ '\nCONFIGURE RETENTION POLICY TO REDUNDANCY 1; # default'
	+ '\nCONFIGURE BACKUP OPTIMIZATION OFF; # default'
	+ '\nCONFIGURE DEFAULT DEVICE TYPE TO DISK;'
	+ '\nCONFIGURE CONTROLFILE AUTOBACKUP OFF; # default'
	+ '\nCONFIGURE CONTROLFILE AUTOBACKUP FORMAT FOR DEVICE TYPE DISK TO "%F"; # defualt'
	+ '\nCONFIGURE DEVICE TYPE DISK BACKUP TYPE TO COPY PALALLELISM 1;'
	+ '\nCONFIGURE DATAFILE BACKUP COPIES FOR DEVICE TYPE DISK TO 1; # default'
	+ '\nCONFIGURE ARCHIVELOG BACKUP COPIES FOR DEVICE TYPE DISK TO 1; # default'
	+ '\nCONFIGURE MAXSETSIZE TO UNLIMITED; # default'
	+ '\nCONFIGURE ENCRYPTION FOR DATABASE OFF; # default'
	+ '\nCONFIGURE ENCRYPTION ALGORITHM "AES128"; # default'
	+ '\nCONFIGURE COMPRESSION ALGORITHM "BASIC" AS OF RELEASE "DEFAULT" OPTIMIZE FOR LOAD TRUE; # default'
	+ '\nCONFIGURE RMAN OUTPUT TO KEEP FOR 7 DAYS; # default'
	+ '\nCONFIGURE ARCHIVELOG DELETION POLICY TO NONE; # default'
	+ '\nCONFIGURE SNAPSHOT CONTROLFILE NAME TO "/u01/app/oracle/product/12.1.0/db_1/dbs/snapcf_orcl.f"; # default'
	+ '\n'
	+ '\nRMAN> BACKUP DATABASE;',
	'GOLD参考書26Pを参照'));
	pushChoice('バックアップセット形式', false);
	pushChoice('圧縮バックアップセット形式', false);
	pushChoice('イメージコピー形式', true);
	pushChoice('ディスク形式', true);
	pushChoice('テープ装置', false);
	pushChoice('ディスク領域とテープ装置の両方', false);
	sortChoice();
	
	// 050
	q_list.push(new Question('バックアップ形式を明示的に指定してバックアップを取得するコマンドとして正しいものを2つ選択しなさい。',
	'GOLD参考書27Pを参照'));
	pushChoice('BACKUP AS BACKUPSET DATABASE', true);
	pushChoice('BACKUP AS BACKUPPIECE DATABASE', false);
	pushChoice('BACKUP AS IMAGECOPY TABLESPACE users;', false);
	pushChoice('BACKUP AS COPY TABLESPACE users;', true);
	sortChoice();
	
	// 051
	q_list.push(new Question('データベースとともにアーカイブログファイルをバックアップするコマンドとして正しいものを選択しなさい。',
	'GOLD参考書27Pを参照'));
	pushChoice('BACKUP DATABASE, ARCHIVELOG;', false);
	pushChoice('BACKUP DATABASE AND ARCHIVELOG;', false);
	pushChoice('BACKUP DATABASE PLUS ARCHIVELOG;', true);
	pushChoice('BACKUP DATABASE + ARCHIVELOG;', false);
	sortChoice();
	
	// 052
	q_list.push(new Question('以下のコマンドで実行される処理として正しいものをすべて選択しなさい。'
	+ '\n'
	+ '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG DELETE INPUT;',
	'GOLD参考書28Pを参照'));
	pushChoice('すべてのデータファイルがバックアップされる', true);
	pushChoice('制御ファイルがバックアップされる', true);
	pushChoice('SPFILEがバックアップされる', true);
	pushChoice('アーカイブログファイルがバックアップされる', true);
	pushChoice('バックアップされたアーカイブログファイルが削除される', true);
	pushChoice('ログスイッチが実行される', true);
	pushChoice('バックアップされた制御ファイルが削除される', false);
	sortChoice();
	
	// 053
	q_list.push(new Question('増分バックアップのメリットとして適切なものを選択しなさい。',
	'GOLD参考書29Pを参照'));
	pushChoice('バックアップ実行時におけるデータファイルの読み取りI/O処理量を減らすことができる', false);
	pushChoice('バックアップファイルのサイズを削減することができる', true);
	pushChoice('障害発生時の復旧時間を短縮することができる', false);
	pushChoice('データベースの起動中にバックアップを取得することができる', false);
	sortChoice();
	
	// 054
	q_list.push(new Question('増分バックアップについてバックアップ処理の内容とコマンドの組み合わせとして正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.更新されていないデータブロックも含めた全体のバックアップを取得する。'
	+ '\n2.直前の増分バックアップ以降で更新されたデータブロックのみのバックアップを取得する。'
	+ '\n3.直前の全体バックアップ以降で更新されたデータブロックのみのバックアップを取得する。'
	+ '\n'
	+ '\ni.BACKUP INCREMENTAL LEVEL 0 DATABASE;'
	+ '\nii.BACKUP INCREMENTAL LEVEL 0 CUMULATIVE DATABASE;'
	+ '\niii.BACKUP INCREMENTAL LEVEL 1 DATABASE;'
	+ '\niv.BACKUP INCREMENTAL LEVEL 1 CUMULATIVE DATABASE;',
	'GOLD参考書30Pを参照'));
	pushChoice('1 → iii、2 → i、3 → ii', false);
	pushChoice('1 → iii、2 → i、3 → i', false);
	pushChoice('1 → i、2 → iii、3 → iv', true);
	pushChoice('1 → i、2 → iv、3 → iii', false);
	sortChoice();
	
	// 055
	q_list.push(new Question('高速増分バックアップを有効にするコマンドとして正しいものを選択しなさい。',
	'GOLD参考書31Pを参照'));
	pushChoice('RMAN> CONFIGURE FAST INCREMENTAL BACKUP ON USING FILE "/disk1/rman_change_track.f";', false);
	pushChoice('RMAN> ALTER DATABASE ENABLE FAST INCREMENTAL BACKUP USING FILE "/disk1/rman_change_track.f";', false);
	pushChoice('RMAN> CONFIGURE BLOCK CHANGE TRACKING ON USING FILE "/disk1/rman_change_track.f";', false);
	pushChoice('RMAN> ALTER DATABASE ENABLE BLOCK CHANGE TRACKING USING FILE "/disk1/rman_change_track.f";', true);
	sortChoice();
	
	// 056
	q_list.push(new Question('RMANを用いた一貫性バックアップに関する説明として正しいものを選択しなさい。',
	'GOLD参考書31Pを参照'));
	pushChoice('インスタンスが完全に停止した状態でバックアップを取得する必要がある', false);
	pushChoice('ARCHIVELOGモードでも、一貫性バックアップを取得できる', true);
	pushChoice('SHUTDOWN ABORTでデータベースを停止しても、その直後にMOUNTモードで起動すれば、一貫性バックアップを取得できる', false);
	pushChoice('データベースの一貫性バックアップを取得するコマンドはBACKUP CONSISTENT DATABASEである', false);
	sortChoice();
	
	// 057
	q_list.push(new Question('RMANコマンドについて、コマンド名とコマンドの説明として正しいものを選択しなさい。',
	'GOLD参考書32Pを参照'));
	pushChoice('LS：バックアップファイル、アーカイブログファイルの確認　RM：バックアップファイル、アーカイブログファイルの削除', false);
	pushChoice('LIST：バックアップファイル、アーカイブログファイルの確認　REMOVE：バックアップファイル、アーカイブログファイルの削除', false);
	pushChoice('LIST：バックアップファイル、アーカイブログファイルの確認　DELETE：バックアップファイル、アーカイブログファイルの削除', true);
	pushChoice('REPORT：バックアップファイル、アーカイブログファイルの確認　DELETE：バックアップファイル、アーカイブログファイルの削除', false);
	sortChoice();
	
	// 058
	q_list.push(new Question('OSコマンドでアーカイブログファイルを削除した状況で、実際のアーカイブログファイルの状態とRMANリポジトリの情報を一致させるために使用するコマンドの組み合わせとして正しいものを選択しなさい。',
	'GOLD参考書33Pを参照'));
	pushChoice('CROSSCHECKコマンドとDELETE EXPIREDコマンド', true);
	pushChoice('RESYNC CATALOGコマンドとDELETE OBSOLETEコマンド', false);
	pushChoice('CROSSCHECKコマンドとDELETE OBSOLETEコマンド', false);
	pushChoice('RESYNC CATALOGコマンドとDELETE EXPIREDコマンド', false);
	sortChoice();
	
	// 059
	q_list.push(new Question('保存ポリシーの観点から不要とみなされるファイルに関する説明について正しいものを2つ選択しなさい。',
	'GOLD参考書34Pを参照'));
	pushChoice('LIST OBSOLETEコマンドで、保存ポリシーの観点から不要なファイルを一覧表示できる', false);
	pushChoice('LIST EXPIREDコマンドで、保存ポリシーの観点から不要なファイルを一覧表示できる', false);
	pushChoice('REPORT OBSOLETEコマンドで、保存ポリシーの観点から不要なファイルを一覧表示できる', true);
	pushChoice('DELETE OBSOLETEコマンドで、保存ポリシーの観点から不要とみなされるファイルを削除できる', true);
	pushChoice('DELETE EXPIREDコマンドで、保存ポリシーの観点から不要とみなされるファイルを削除できる', false);
	sortChoice();
	
	// 060
	q_list.push(new Question('通常の増分バックアップと比較した増分更新バックアップの利点として正しいものを選択しなさい。',
	'GOLD参考書35Pを参照'));
	pushChoice('復旧に要する時間を短縮できる', true);
	pushChoice('バックアップに要する時間を短縮できる', false);
	pushChoice('最後に実行されたレベル0バックアップ以降に更新されたすべてのブロックをバックアップする', false);
	pushChoice('バックアップファイルのサイズを削減できる', false);
	sortChoice();
	
	// 061
	q_list.push(new Question('レベル0の増分バックアップを取得していない状況で以下のコマンドを実行した結果として正しいものを選択しなさい。'
	+ '\n'
	+ '\nBACKUP INCREMENTAL LEVEL 1 DATABASE;',
	'GOLD参考書35Pを参照'));
	pushChoice('エラーが発生し、バックアップ処理が実行されない', false);
	pushChoice('レベル0の増分バックアップが取得される', true);
	pushChoice('レベル1の差分増分バックアップが取得される', false);
	pushChoice('レベル1の累積増分バックアップが取得される', false);
	sortChoice();
	
	// 062
	q_list.push(new Question('バックアップの圧縮に関する説明として正しいものを選択しなさい。',
	'GOLD参考書37Pを参照'));
	pushChoice('バックアップセット形式でデータファイルをバックアップすると、デフォルトでバイナリ圧縮が有効になる', false);
	pushChoice('バックアップセット形式でデータファイルをバックアップすると、デフォルトで未使用ブロックの圧縮が有効となる', true);
	pushChoice('イメージコピー形式でデータファイルをバックアップすると、デフォルトでバイナリ圧縮が有効になる', false);
	pushChoice('イメージコピー形式でデータファイルをバックアップすると、デフォルトで未使用ブロックの圧縮が有効になる', false);
	sortChoice();
	
	// 063
	q_list.push(new Question('バイナリ圧縮のアルゴリズムに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書38Pを参照'));
	pushChoice('デフォルトのバイナリ圧縮のアルゴリズムはMEDIUMである', false);
	pushChoice('CPUリソース使用量が大きいバイナリ圧縮のアルゴリズムはHIGHである', true);
	pushChoice('圧縮速度が遅いバイナリ圧縮のアルゴリズムはLOWである', false);
	pushChoice('Oracle Advanced Compressionオプションがない場合に使用できるバイナリ圧縮のアルゴリズムはBASICのみである', true);
	sortChoice();
	
	// 064
	q_list.push(new Question('バイナリ圧縮が適用された圧縮バックアップを取得するため、以下の一連のコマンドを実行します。'
	+ '\n(X)の箇所で実行すべきコマンドを選択しなさい。'
	+ '\n'
	+ '\nRMAN> CONFIGURE DEFAULT DEVICE TYPE TO disk;'
	+ '\nRMAN> (X)'
	+ '\nRMAN> BACKUP DATABASE;',
	'GOLD参考書38Pを参照'));
	pushChoice('CONFIGURE DEVICE TYPE DISK BACKUP TYPE TO COMPRESSED BACKUPSET;', true);
	pushChoice('CONFIGURE COMPRESSED BACKUPSET ON;', false);
	pushChoice('CONFIGURE BACKUPSET COMPRESSION ALGORITHM "MEDIUM";', false);
	pushChoice('CONFIGURE DEFAULT BACKUPSET TO COMPRESSED;', false);
	sortChoice();
	
	// 065
	q_list.push(new Question('パラレルバックアップを取得するため、以下の一連のコマンドを実行します。'
	+ '\n(X)の箇所で実行すべきコマンドを選択しなさい。'
	+ '\n'
	+ '\nRMAN> CONFIGURE DEFAULT DEVICE TYPE TO disk;'
	+ '\nRMAN> (X)'
	+ '\nRMAN> BACKUP DATABASE;',
	'GOLD参考書39Pを参照'));
	pushChoice('CONFIGURE DEVICE TYPE disk PARALLELISM 4;', true);
	pushChoice('CONFIGURE PARALLELISM 4;', false);
	pushChoice('CONFIGURE DEVICE TYPE disk PARALLEL 4;', false);
	pushChoice('CONFIGURE PARALLEL 4;', false);
	sortChoice();
	
	// 066
	q_list.push(new Question('以下のコマンドを実行したときの動作について、正しい説明を選択しなさい。'
	+ '\n'
	+ '\nRMAN> CONFIGURE DEVICE TYPE disk PARALLELISM 4;'
	+ '\nRMAN> RUN {'
	+ '\n2>      ALLOCATE CHANNEL c1 DEVICE TYPE DISK;'
	+ '\n3>      ALLOCATE CHANNEL c2 DEVICE TYPE DISK;'
	+ '\n4>      BACKUP DATABASE;'
	+ '\n5>    }',
	'GOLD参考書40Pを参照'));
	pushChoice('並列度1でバックアップする', false);
	pushChoice('並列度2でバックアップする', true);
	pushChoice('並列度4でバックアップする', false);
	sortChoice();
	
	// 067
	q_list.push(new Question('以下のコマンドを実行したときの動作について、正しい説明を選択しなさい。'
	+ '\n'
	+ '\nRMAN> RUN {'
	+ '\n2>       ALLOCATE CHANNEL c1 DEVICE TYPE DISK;'
	+ '\n3>       ALLOCATE CHANNEL c2 DEVICE TYPE DISK;'
	+ '\n4>       BACKUP'
	+ '\n5>         (DATAFILE 1,2,3 CHANNEL c1)'
	+ '\n6>         (DATAFILE 4,5,6 CHANNEL c2);'
	+ '\n7>    }',
	'GOLD参考書40Pを参照'));
	pushChoice('多重化バックアップでバックアップを取得する', false);
	pushChoice('1つのデータファイルを並列でバックアップする', false);
	pushChoice('並列度2のパラレルバックアップが実行される', true);
	pushChoice('エラーで失敗する', false);
	sortChoice();
	
	// 068
	q_list.push(new Question('Oracle Database 12cのマルチセクションバックアップに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書41Pを参照'));
	pushChoice('非常に大きなサイズのデータファイルのバックアップ高速化に有効な場合がある', true);
	pushChoice('小さなサイズのデータファイルが多数ある場合のバックアップ高速化に有効な場合がある', false);
	pushChoice('パラレルバックアップのための複数チャネル設定は不要である', false);
	pushChoice('パラレルバックアップのための複数チャネル設定は必要である', true);
	pushChoice('バックアップ形式はバックアップセットのみが選択可能で、イメージコピーは選択できない', false);
	sortChoice();
	
	// 069
	q_list.push(new Question('データファイルの多重化バックアップセットを取得するため、以下の一連のコマンドを実行します。'
	+ '\n(X)の箇所で実行すべきコマンドを選択しなさい。'
	+ '\n'
	+ '\nRMAN> CONFIGURE DEFAULT DEVICE TYPE TO disk;'
	+ '\nRMAN> CONFIGURE CHANNEL DEVICE TYPE TO DISK FORMAT "/disk1/%U , /disk2/%U";'
	+ '\nRMAN> (X)'
	+ '\nRMAN> BACKUP AS BACKUPSET DATABASE;',
	'GOLD参考書42Pを参照'));
	pushChoice('CONFIGURE MAXCOPYSIZE TO 2', false);
	pushChoice('CONFIGURE DEVICE TYPE DISK COPIES 2 BACKUP TYPE TO BACKUPSET;', false);
	pushChoice('CONFIGURE DEVICE TYPE DISK PARALLELISM 2;', false);
	pushChoice('CONFIGURE DATAFILE BACKUP COPIES FOR DEVICE TYPE DISK TO 2;', true);
	sortChoice();
	
	// 070
	q_list.push(new Question('バックアップを半永久的に保存するため、以下のコマンドを実行しました。'
	+ '\nこのコマンドの説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nBACKUP KEEP FOREVER DATABASE;',
	'GOLD参考書43Pを参照'));
	pushChoice('リカバリカタログに接続した状態で実行する必要がある', true);
	pushChoice('このコマンドで取得されたバックアップはDELETE OBSOLETEコマンドを実行すると削除される', false);
	pushChoice('デフォルトのバックアップ出力先が高速リカバリ領域に設定されている場合、エラーが発生しバックアップが取得できない', true);
	pushChoice('保存ポリシーが無効化され、以降バックアップしたすべてのバックアップファイルが一切不要とみなされなくなる', false);
	sortChoice();
	
	// 071
	q_list.push(new Question('制御ファイルをバックアップするため、以下のコマンドを実行しました。'
	+ '\nこのコマンドの動作として正しいものを選択しなさい。'
	+ '\n'
	+ '\nSQL> ALTER DATABASE BACKUP CONTROLFILE TO TRACE;',
	'GOLD参考書44Pを参照'));
	pushChoice('高速リカバリ領域に制御ファイルをコピーしたバックアップを作成する', false);
	pushChoice('トレースファイルに制御ファイルを再作成するために実行するCREATE CONTROLFILE文を出力する', true);
	pushChoice('制御ファイルがバックアップされたとき、トレースファイルに詳細情報を出力する', false);
	pushChoice('制御ファイルの自動バックアップを有効化する', false);
	sortChoice();
	
	// 072
	q_list.push(new Question('アーカイブログをバックアップします。'
	+ '\n以下のコマンドで(X)に入るキーワードとして正しいものを選択しなさい。'
	+ '\n'
	+ '\nRMAN> BACKUP ARCHIVELOG (X);',
	'GOLD参考書44Pを参照'));
	pushChoice('ALL', true);
	pushChoice('EXPIRED', false);
	pushChoice('OBSOLETE', false);
	pushChoice('指定不要', false);
	sortChoice();
	
	// 073
	q_list.push(new Question('ASMディスクグループのメタデータをバックアップするため、以下のコマンドを実行しました。'
	+ '\nこのコマンドの動作の説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nASMCMD> md_backup /disk/ASMDG_metadata.bk -G DG1',
	'GOLD参考書45Pを参照'));
	pushChoice('バックアップしたメタデータは、何らかの理由でASMディスクグループDG1が破損した場合、ASMディスクからASMディスクグループを再度作成するときに使用できる', true);
	pushChoice('データファイルがASMディスクグループDG1に格納されている場合、このデータファイルもあわせてバックアップされる', false);
	pushChoice('バックアップしたメタデータは、/disk1/ASMDG_metadata.bkに出力される', true);
	pushChoice('バックアップしたメタデータは、$ORACLE_HOME/dbs/asmdg.bkに出力される', false);
	sortChoice();
	
	// 074
	q_list.push(new Question('RMANの暗号化バックアップに関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書46Pを参照'));
	pushChoice('透過モード暗号化バックアップを実行するには、あらかじめキーストアをOPENしておく必要がある', true);
	pushChoice('パスワードモード暗号化バックアップを実行するには、あらかじめキーストアをOPENしておく必要がある', false);
	pushChoice('デュアルモード暗号化バックアップを実行するには、あらかじめキーストアをOPENしておく必要がある', true);
	pushChoice('透過モード暗号化バックアップをリストアするには、あらかじめキーストアをOPENしておく必要がある', true);
	pushChoice('パスワードモード暗号化バックアップをリストアするには、あらかじめキーストアをOPENしておく必要がある', false);
	pushChoice('デュアルモード暗号化バックアップをリストアするには、あらかじめキーストアをOPENしておく必要がある', false);
	sortChoice();
	
	// 075
	q_list.push(new Question('透過モード暗号化バックアップを取得する手段として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.キーストアをOPENします。'
	+ '\n2.SET ENCRYPTION ON IDENTIFIED BY password ONLY;'
	+ '\n3.CONFIGURE ENCRYPTION FOR DATABASE ON;'
	+ '\n4.BACKUP DATABASE;'
	+ '\n5.BACKUP DATABASE ENCRYPTED',
	'GOLD参考書47Pを参照'));
	pushChoice('1 → 2 → 4', false);
	pushChoice('1 → 2 → 5', false);
	pushChoice('1 → 3 → 4', true);
	pushChoice('1 → 3 → 5', false);
	pushChoice('2 → 4', false);
	pushChoice('2 → 5', false);
	sortChoice();
	
	// 076
	q_list.push(new Question('パスワードモード暗号化バックアップを実行化するため、(X)に入るコマンドを選択しなさい。'
	+ '\n'
	+ '\nRMAN> (X)'
	+ '\nRMAN> BACKUP DATABASE;',
	'GOLD参考書48Pを参照'));
	pushChoice('SET ENCRYPTION IDENTIFIED BY password ONLY;', false);
	pushChoice('SET ENCRYPTION ON FOR ALL TABLESPACE IDENTIFIED BY password ONLY;', true);
	pushChoice('SET ENCRYPTION IDENTIFIED BY password;', false);
	pushChoice('SET ENCRYPTION ON FOR ALL TABLESPACE IDENTIFIED BY password;', false);
	sortChoice();
	
	// 077
	q_list.push(new Question('デュアル暗号化バックアップに関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書49Pを参照'));
	pushChoice('バックアップ時にはキーストアがOPENされている必要がある', true);
	pushChoice('バックアップ時にキーストアを使用するかどうかは状況に応じて選択できる', false);
	pushChoice('リストア先の環境でバックアップ時に使用したキーストアが使用できない場合、バックアップ時に指定したパスワードでバックアップをリストアできる', true);
	pushChoice('リストア先の環境でバックアップ時に使用したキーストアが使用できない場合、バックアップ時に使用したキーストアのパスワードでバックアップをリストアできる', false);
	pushChoice('バックアップ取得時において、パスワードを指定するSET ENCRYPTION ON IDENTIFIED BY コマンドにONLY句を指定する', false);
	pushChoice('バックアップ取得時において、パスワードを指定するSET ENCRYPTION ON IDENTIFIED BY コマンドにONLY句を指定しない', true);
	sortChoice();
	
	// 078
	q_list.push(new Question('OracleインスタンスのADRベースのディレクトリパスを設定する初期化パラメータとして正しいものを選択してください。',
	'GOLD参考書50Pを参照'));
	pushChoice('AUDIT_FILE_DEST', false);
	pushChoice('BACKGROUP_DUMP_DEST', false);
	pushChoice('CORE_DUMP_DEST', false);
	pushChoice('DB_CREATE_FILE_DEST', false);
	pushChoice('DB_RECOVERY_FILE_DEST', false);
	pushChoice('DIAGNOSTIC_DEST', true);
	sortChoice();
	
	// 079
	q_list.push(new Question('以下に示す構成の環境において、OracleインスタンスのADRベースおよびADRホームとなるディレクトリパスの組み合わせとして正しいものを選択しなさい。'
	+ '\n'
	+ '\nDIAGNOSTIC_DEST初期化パラメータは未設定'
	+ '\n環境変数ORACLE_BASE=/u01/app/oracle'
	+ '\n環境変数ORACLE_HOME=/u01/app/oracle/product/12.1.0/db_1'
	+ '\nデータベース名、ORACLE_SIDともにorcl',
	'GOLD参考書51Pを参照'));
	pushChoice('ADRベース：/u01/app/oracle/　ADRホーム：/u01/app/oracle/diag/rdbms/orcl/orcl', true);
	pushChoice('ADRベース：/u01/app/oracle/　ADRホーム：/u01/app/oracle/rdbms/orcl/orcl', false);
	pushChoice('ADRベース：/u01/app/oracle/　ADRホーム：/u01/app/oracle/product/12.1.0/db_1/', false);
	pushChoice('ADRベース：/u01/app/oracle/product/12.1.0/db_1/　ADRホーム：/u01/app/oracle/rdbms/orcl/orcl', false);
	sortChoice();
	
	// 080
	q_list.push(new Question('ADRに格納されるデータを2つ選択しなさい。',
	'GOLD参考書52Pを参照'));
	pushChoice('バックアップファイル', false);
	pushChoice('アーカイブログファイル', false);
	pushChoice('アラートログファイル', true);
	pushChoice('トレースファイル', true);
	pushChoice('AWRスナップショット', false);
    sortChoice();
    
    // 081
    q_list.push(new Question('メディア・リカバリが必要なシナリオはどれですか。',
    'データファイルが破損した場合はメディアリカバリが必要である。'
    + '\n多重化している制御ファイルの一部が失われた場合は、正常な制御ファイルをコピーすればよい。'
    + '\n必要なアーカイブログファイルを誤って削除した場合は、バックアップをすぐに取り直せば問題ない。'
    + '\nインスタンスが異常終了した場合はインスタンスリカバリが自動的に行われる。'
    + '\n必要な表を削除してすぐに気づいた場合にはフラッシュバックドロップで復旧が可能。'
    + '\n一時表領域は再作成が可能である。'));
    pushChoice('多重化している制御ファイルの一部が失われた場合', false);
    pushChoice('必要なアーカイブログファイルを誤って削除した場合', false);
    pushChoice('インスタンスが異常終了した場合', false);
    pushChoice('必要な表を削除してしまい、すぐに気づいた場合', false);
    pushChoice('データファイルが破損した場合', true);
    pushChoice('一時表領域を構成するファイルがすべて破損した場合', false);
    sortChoice();

    // 082
    q_list.push(new Question('NOARCHIVELOGモードで運用しているデータベースで、USER表領域に属するデータファイルの一つが破損しました。'
    + '\nインスタンスは停止しています。'
    + '\nオンラインREDOログは、最新のバックアップ以後にすべて上書きされています。'
    + '\nデータベースを再起動するには、何を行いますか。',
    'NOARCHIVELOGの場合は、すべてのデータファイルと制御ファイルをリストアする必要がある。'));
    pushChoice('最新のバックアップから破損したデータファイルをリストアして、インスタンスを再起動する', false);
    pushChoice('最新のバックアップからUSER表領域に属するすべてのデータファイルをリストアし、インスタンスを再起動する', false);
    pushChoice('最新のバックアップからすべてのデータファイルをリストアし、インスタンスを再起動する', false);
    pushChoice('最新のバックアップからすべてのデータファイルと制御ファイルをリストアし、UNTIL CANCELオプションをつけて不完全リカバリを行う', true);
    sortChoice();

    // 083
    q_list.push(new Question('CONFIGUREコマンドで設定できることはどれですか。'
    + '\n2つ選択してください。',
    'バックアップピースのサイズの制限　→　CONFIGURE MAXPIECESIZE'
    + '\nセクションサイズの制限　→　BACKUPコマンドで設定'
    + '\nブロック変更トラッキングの有効・無効　→　ALTER DATABASE ENABLE BLOCK CHANGE TRACKING;'
    + '\n表領域ごとの暗号化の有効・無効　→　CONFIGURE ENCRYPTION FOR TABLESPACE <表領域名> ON;'));
    pushChoice('バックアップピースのサイズの制限', true);
    pushChoice('セクションサイズの制限', false);
    pushChoice('フロック変更トラッキングの有効・無効', false);
    pushChoice('表領域ごとの暗号化の有効・無効', true);
    sortChoice();

    // 084
    q_list.push(new Question('リカバリカタログが必須となるケースを3つ選択してください。',
    '他にRMANストアドスクリプトを使用する場合、保存先がリカバリカタログとなるため必須である。'));
    pushChoice('KEEP FOREVER句をつけてバックアップを取得する場合', true);
    pushChoice('Data Gurad環境でRMANを使用する場合', true);
    pushChoice('不完全リカバリを行う場合', false);
    pushChoice('AT time句をつけてREPORT SCHEMAコマンドを実行する場合', true);
    pushChoice('制御ファイルの自動バックアップを有効化する場合', false);
    pushChoice('常にオンラインで稼働する必要があるシステム', false);
    sortChoice();

    // 085
    q_list.push(new Question('常に稼働しているシステムがあります。'
    + '\n最低限、満たす必要がある項目はどれですか。',
    'オンラインでバックアップを取得するためにはARCHIVELOGモードである必要がある。'
    + '\nbackupモードで運用するとログの生成量が増加し、パフォーマンスが低下する。'));
    pushChoice('制御ファイルの自動バックアップを設定する', false);
    pushChoice('フラッシュバックログを有効化する', false);
    pushChoice('高速リカバリ領域をASMに格納する', false);
    pushChoice('一時ファイル以外のすべてのデータファイルをbackupモードで運用する', false);
    pushChoice('ARCHIVELOGモードで運用する', true);
    sortChoice();

    // 086
    q_list.push(new Question('毎週土曜日に、使用されているすべてのデータファイルのイメージコピーを取り直す。'
    + '\n他の曜日は、前日取得したバックアップを使用し、イメージコピーを更新し、更に前回のバックアップ以降に変更されたブロックのみバックアップする。'
    + '\n各曜日に実行するコマンドとして、正しい組み合わせはどれですか。'
    + '\n'
    + '\na.BACKUP AS COPY DATABASE;'
    + '\nb.BACKUP AS COPY INCREMENTAL LEVEL 0 DATABASE;'
    + '\nc.RECOVER COPY OF DATABASE WITH TAG "DAILY";'
    + '\nd.BACKUP INCREMENTAL LEVEL 1 FOR RECOVER OF COPY WITH TAG "DAILY" DATABASE;'
    + '\ne.BACKUP INCREMENTAL LEVEL 1 CUMULATIVE DATABASE;',
    ''));
    pushChoice('土曜日：a、他の曜日：c,d', false);
    pushChoice('土曜日：b、他の曜日：c,d', true);
    pushChoice('土曜日：a、他の曜日：c,e', false);
    pushChoice('土曜日：b、他の曜日：c,e', false);
    sortChoice();

    // 087
    q_list.push(new Question('10TBのデータファイルをバックアップしようと考えています。'
    + '\nデータファイルのバックアップが遅く困っています。'
    + '\nどのタイプのバックアップにすればよいですか。',
    ''));
    pushChoice('RMANによる多重化バックアップ', false);
    pushChoice('RMANによるマルチセクションバックアップ', true);
    pushChoice('高速リカバリ領域へのバックアップ', false);
    pushChoice('RMANによる圧縮バックアップ', false);
    pushChoice('コールドバックアップ', false);
    sortChoice();

    // 088
    q_list.push(new Question('次のコマンドを確認してください。'
    + '\n'
    + '\nRMAN> CONFIGURE ENCRYPTION FOR TABLESPACE <表領域名> ON'
    + '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG'
    + '\n'
    + '\nバックアップを行うにはどの前提条件が満たされている必要がありますか。',
    '暗号化用のパスワードを設定しておく　→　パスワードモードの暗号化'
    + '\nOracleウォレットを設定しておく　→　透過モードの暗号化'));
    pushChoice('暗号化用のパスワードを設定しておく', false);
    pushChoice('Oracleウォレットを設定しておく', true);
    pushChoice('該当の表領域をTDEで暗号化しておく', false);
    pushChoice('統合監査を設定しておく', false);
    sortChoice();

    // 089
    q_list.push(new Question('次の一連のコマンドを実行しました。'
    + '\n'
    + '\nRMAN> BACKUP VALIDATE DATABASE;'
    + '\nRMAN> RECOVER CORRUPTION LIST;'
    + '\n'
    + '\n正しい説明を選択してください。',
    '破損ブロックを含むデータファイルをオフラインにしておく必要がある　→　ブロックメディアリカバリはオンラインでリカバリ可能'
    + '\n一連のコマンドにより、バックアップの破損が修復される　→　このコマンドで行われるのはデータベースの修復でありバックアップの修復ではない'
    + '\nNOARCHIVELOGモードでも修復できる　→　ブロックメディアリカバリはARCHIVELOGモード'));
    pushChoice('V$DATABASE_BLOCK_CORRUPTIONを問い合わせ、破損ブロックを含むデータファイルをオフラインにしておく必要がある', false);
    pushChoice('一連のコマンドにより、バックアップの破損が修復される', false);
    pushChoice('全体バックアップもしくはレベル0のバックアップが必要である', true);
    pushChoice('NOARCHIVELOGモードでも修復できる', false);
    sortChoice();
    
    // 090
	q_list.push(new Question('ADRの実体に関する説明として正しいものを選択しなさい。',
	'GOLD参考書52Pを参照'));
	pushChoice('SYSAUX表領域に格納されたデータの集合体', false);
	pushChoice('あるディレクトリ以下にあるログファイルの集合体', true);
	pushChoice('高速リカバリ領域に出力されるバックアップファイルおよびアーカイブログファイルの集合体', false);
	pushChoice('データベースの管理情報、内部動作情報をSELECT文から問い合わせ可能な特殊なビューの集合体', false);
	sortChoice();
	
	// 091
	q_list.push(new Question('データブロックおよびブロック破損に関する説明として正しいものを選択しなさい。',
	'GOLD参考書53Pを参照'));
	pushChoice('データブロックの中身が破損し、Oracleのブロックとして不正なフォーマットになる種の破損をブロックの論理破損と呼ぶ', false);
	pushChoice('RMANのBACKUPコマンドにCHECK CORRUPT句を指定すると、バックアップ取得時にブロック破損をチェックする', false);
	pushChoice('RMANのBACKUP VALIDATEコマンドを実行すると、バックアップの取得とあわせてブロック破損のチェックを行う', false);
	pushChoice('RMANによる破損ブロックチェックで検出されたブロック破損に関する情報は、V$DATABASE_BLOCK_CORRUPTIONビューに格納される', true);
	pushChoice('ブロック破損を修復するには、データベース管理者によるバックアップのリストアおよびリカバリ作業が必要である', false);
	sortChoice();
	
	// 092
	q_list.push(new Question('RMANのコマンドを用いて、データベース全体のブロック破損をチェックし、検出されたすべてのブロック破損を修復したいと考えます。'
	+ '\n最も少ない手順で目的を達成できる手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.BACKUP VALIDATE DATABASE;'
	+ '\n2.BACKUP VALIDATE DATAFILE ALL;'
	+ '\n3.RECOVER ALL CORRUPTIONS;'
	+ '\n4.RECOVER CORRUPTION LIST;'
	+ '\n5.検出されたすべての破損ブロックに対して、以下のコマンドを実行'
	+ '\n'
	+ '\nRECOVER DATAFILE <ファイル番号> BLOCK <ブロック番号>;',
	'GOLD参考書53Pを参照'));
	pushChoice('1 → 3', false);
	pushChoice('1 → 4', true);
	pushChoice('1 → 5', false);
	pushChoice('2 → 3', false);
	pushChoice('2 → 4', false);
	pushChoice('2 → 5', false);
	sortChoice();
	
	// 093
	q_list.push(new Question('データリカバリアドバイザに関する説明として正しいものを選択しなさい。',
	'GOLD参考書54Pを参照'));
	pushChoice('通常のメディア障害からの復旧（リストア、リカバリ）とはまったく異なる仕組みを用いて、障害から復旧できる', false);
	pushChoice('利用者の誤操作などに起因する人為的なデータロスを取り消すことができる', false);
	pushChoice('RACデータベースをサポートしていない', true);
	pushChoice('データリカバリアドバイザを使用するには、Oracle Enterprise Managerから操作を行う必要がある', false);
	sortChoice();
	
	// 094
	q_list.push(new Question('データリカバリアドバイザを用いてデータベースメディアのメディア障害から復旧するために、RMANで実行すべき一覧のコマンドの実行順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.CHECK FAILURE'
	+ '\n2.LIST FAILURE'
	+ '\n3.ADVISE FAILURE'
	+ '\n4.ANALYZE FAILURE'
	+ '\n5.REPAIR FAILURE'
	+ '\n6.FIX FAILURE',
	'GOLD参考書55Pを参照'));
	pushChoice('1 → 3 → 5', false);
	pushChoice('1 → 3 → 6', false);
	pushChoice('1 → 4 → 5', false);
	pushChoice('2 → 4 → 6', false);
	pushChoice('2 → 3 → 5', true);
	pushChoice('2 → 3 → 6', false);
	sortChoice();
	
	// 095
	q_list.push(new Question('メディア障害発生時の動作に関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書56Pを参照'));
	pushChoice('SYSTEM表領域およびUNDO表領域以外の永続表領域を構成するデータファイルに障害が発生した場合、インスタンスは自動的に強制停止する', false);
	pushChoice('SYSTEM表領域を構成するデータファイルに障害が発生した場合、インスタンスは自動的に強制停止する', true);
	pushChoice('UNDO表領域を構成するデータファイルに障害が発生した場合、インスタンスは自動的に強制停止する', true);
	pushChoice('ある1つのデータファイルが破損した場合、そのデータファイルで構成される表領域全体をリストア／リカバリする必要がある', false);
	pushChoice('ある1つのデータファイルが破損した場合、そのデータファイルだけをリストア／リカバリする', true);
	sortChoice();
	
	// 096
	q_list.push(new Question('RMANのRESTOREコマンドとRECOVERコマンドに関する説明として正しいものを選択しなさい。',
	'GOLD参考書57Pを参照'));
	pushChoice('RESTOREコマンドを実行すると、障害が発生したファイルを自動的に特定し、そのファイルについてリストア処理が実行される', false);
	pushChoice('RESTOREコマンドを実行すると、最新のバックアップファイルを自動的に特定し、そのバックアップファイルからファイルをリストアする', true);
	pushChoice('RECOVERコマンドを実行すると、必要なアーカイブログファイルに含まれるREDOを適用する。しかし、オンラインログファイルに含まれるREDO適用は行わない', false);
	pushChoice('差分増分バックアップを取得している場合、RESTOREコマンド実行時にレベル0の増分バックアップに対してレベル1の差分増分バックアップが適用される', false);
	pushChoice('バックアップセットがRMANバイナリ圧縮されている場合は、RESTOREコマンドにUNCOMPRESS句を指定する必要がある', false);
	sortChoice();
	
	// 097
	q_list.push(new Question('表領域EXAMPLEを構成するデータファイル/u01/app/oracle/oradata/orcl/example01.dbfにメディア障害が発生しました。'
	+ '\nデータベースはARCHIVELOGモードで運用されています。'
	+ '\n障害を復旧するために実行すべきリストア／リカバリコマンドを選択しなさい。'
	+ '\nなお、複数の方法が選択可能な場合は、最も処理時間が短いと予想される方法を選択すること。',
	'GOLD参考書57Pを参照'));
	pushChoice('ALTER TABLESPACE example OFFLINE IMMEDIATE; RESTORE DATAFILE <path>; RECOVER DATAFILE <path>; ALTER TABLESPACE example ONLINE;', true);
	pushChoice('ALTER TABLESPACE example OFFLINE IMMEDIATE; RESTORE DATAFILE example; RECOVER DATAFILE example; ALTER TABLESPACE example ONLINE;', false);
	pushChoice('ALTER TABLESPACE example OFFLINE IMMEDIATE; RESTORE TABLESPACE example; RECOVER TABLESPACE example; ALTER TABLESPACE example ONLINE;', false);
	pushChoice('ALTER TABLESPACE example OFFLINE IMMEDIATE; RESTORE TABLESPACE; RECOVER TABLESPACE; ALTER TABLESPACE example ONLINE;', false);
	sortChoice();
	
	// 098
	q_list.push(new Question('NOARCHIVELOGモードのデータベースにおいて、メディア障害が発生した場合の復旧に関する説明として正しいものを選択しなさい。',
	'GOLD参考書59Pを参照'));
	pushChoice('破損したファイルのみをリストアすれば、破損していないファイルはそのまま使用できる', false);
	pushChoice('障害発生直前の状態に復旧できる', false);
	pushChoice('バックアップセット形式、イメージコピー形式の両方バックアップ形式に対応している', true);
	pushChoice('オンラインログファイルが不要な場合にのみ、RESETLOGオプション付きでデータベースをオープンする必要がある。オンラインログファイルが必要な場合は、RESETLOGSオプションを指定する必要はない', false);
	sortChoice();
	
	// 099
	q_list.push(new Question('NOARCHIVELOGモードのデータベースにおいて、表領域EXAMPLEを構成するデータファイル/u01/app/oracle/oradata/orcl/example01.dbfにメディア障害が発生しました。'
	+ '\n復旧作業において、RMANで実行すべき一連のコマンドの実行順として正しいものを選択しなさい。'
	+ '\nなお、制御ファイルは自動バックアップからリストアすることとします。'
	+ '\n'
	+ '\n1.STARTUP NOMOUNT'
	+ '\n2.STARTUP MOUNT'
	+ '\n3.RESTORE CONTROLFILE FROM AUTOBACKUP;'
	+ '\n4.ALTER TABLESPACE example OFFLINE IMMEDIATE;'
	+ '\n5.RESTORE DATAFILE <path>;'
	+ '\n6.RECOVER DATAFILE <path>;'
	+ '\n7.ALTER TABLESPACE example ONLINE;'
	+ '\n8.ALTER DATABASE MOUNT;'
	+ '\n9.RESTORE DATABASE;'
	+ '\n10.RECOVER DATABASE;'
	+ '\n11.ALTER DATABASE OPEN;'
	+ '\n12.ALTER DATABASE OPEN RESETLOGS;',
	'GOLD参考書59Pを参照'));
	pushChoice('1 → 3 → 8 → 9 → 10 → 12', false);
	pushChoice('2 → 3 → 8 → 9 → 10 → 12', false);
	pushChoice('1 → 3 → 8 → 9 → 12', true);
	pushChoice('2 → 3 → 8 → 9 → 11', false);
	pushChoice('1 → 3 → 8 → 4 → 5 → 7 → 12', false);
	pushChoice('2 → 3 → 9 → 12', false);
	sortChoice();
	
	// 100
	q_list.push(new Question('NOARCHIVELOGモードのデータベースで、差分増分バックアップを用いてバックアップを取得しているとします。'
	+ '\nメディア障害が発生時の復旧作業において、RMANで実行すべき一連のコマンドの実行順として正しいものを選択しなさい。'
	+ '\nなお、制御ファイルは自動バックアップからリストアすることとします。'
	+ '\n'
	+ '\n1.STARTUP NOMOUNT'
	+ '\n2.RESTORE CONTROLFILE FROM BACKUP;'
	+ '\n3.ALTER DATABASE MOUNT;'
	+ '\n4.RESTORE DATABASE;'
	+ '\n5.RESTORE DATABASE NOREDO;'
	+ '\n6.RECOVER DATABASE;'
	+ '\n7.RECOVER DATABASE NOREDO;'
	+ '\n8.ALTER DATABASE OPEN RESETLOGS;',
	'GOLD参考書61Pを参照'));
	pushChoice('1 → 2 → 3 → 4 → 7 → 8', true);
	pushChoice('1 → 2 → 3 → 5 → 7 → 8', false);
	pushChoice('1 → 2 → 3 → 5 → 6 → 8', false);
	pushChoice('1 → 2 → 3 → 5 → 8', false);
	sortChoice();
	
	// 101
	q_list.push(new Question('一時ファイルが失われた場合の復旧手順として正しいものを選択しなさい。'
	+ '\nなお、できる限りデータベースの動作に影響を与えず、現行の構成を維持できる方法を選ぶこと。',
	'GOLD参考書62Pを参照'));
	pushChoice('一時表領域をIMMEDIATEモードでオフラインにした後、一時ファイルをリストア／リカバリし、一時表領域をオンラインにする', false);
	pushChoice('失われた一時ファイルを削除した後、同様の構成で一時ファイルを改めて作成する', true);
	pushChoice('インスタンスが強制停止されるため、MOUNTモードでインスタンスを起動した後、一時ファイルをリストア／リカバリし、データベースをOPENする', false);
	pushChoice('新しい一時表領域を作成し、この表領域をデータベースおよびユーザーのデフォルト一時表領域とする', false);
	pushChoice('インスタンスを再起動する', false);
	sortChoice();
	
	// 102
	q_list.push(new Question('索引専用の表領域（索引だけ格納していた表領域）を構成するデータファイルが失われた場合の復旧手順として正しいものを2つ選択しなさい。',
	'GOLD参考書63Pを参照'));
	pushChoice('表領域をIMMEDIATEモードでオフラインにした後、表領域を構成するデータファイルをリストア／リカバリし、表領域をオンラインにする', true);
	pushChoice('失われたデータファイルを削除した後、同様の構成でデータファイルを改めて作成する', false);
	pushChoice('インスタンスが強制停止されるため、MOUNTモードでインスタンスを起動した後、データファイルをリストア／リカバリし、データベースをOPENする', false);
	pushChoice('破損した表領域を再作成してから、破損した表領域に格納されていた索引を再作成する', true);
	pushChoice('インスタンスを再起動する', false);
	sortChoice();
	
	// 103
	q_list.push(new Question('読み取り専用表領域のバックアップと復旧に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書63Pを参照'));
	pushChoice('デフォルトのRMAN設定で、読み取り専用表領域のバックアップがスキップされることがある', false);
	pushChoice('RMANでバックアップの最適化設定を有効にすると、読み取り専用表領域のバックアップがスキップされることがある', true);
	pushChoice('読み取り専用表領域を構成するとデータファイルに障害が発生した場合、復旧にはデータファイルのリストアとリカバリが必要である', false);
	pushChoice('読み取り専用表領域を構成するデータファイルに障害が発生した場合、復旧にはデータファイルのリストアのみが必要である', true);
	sortChoice();
	
	// 104
	q_list.push(new Question('SPFILEが失われた場合の復旧手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.バックアップからSPFILEをリストアする。'
	+ '\n2.バックアップからテキスト形式の初期化パラメータファイル（PFILE）をリストアする。'
	+ '\n3.リストアしたPFILEからSPFILEを作成する。'
	+ '\n4.仮のSPFILEを用いてNOMOUNTモードでインスタンスを起動する。'
	+ '\n5.リストアしたSPFILEを用いてインスタンスを再起動する。'
	+ '\n6.リストアしたPFILEを用いてインスタンスを再起動する。'
	+ '\n7.DBIDを設定する。',
	'GOLD参考書64Pを参照'));
	pushChoice('7 → 1 → 5', false);
	pushChoice('4 → 7 → 1 → 5', true);
	pushChoice('7 → 2 → 6', false);
	pushChoice('4 → 7 → 2 → 6', false);
	pushChoice('7 → 2 → 3 → 6', false);
	pushChoice('4 → 7 → 2 → 3 → 6', false);
	sortChoice();
	
	// 105
	q_list.push(new Question('多重化されたすべての制御ファイルが失われた場合の復旧手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.NOMOUNTモードでデータベースを起動する。'
	+ '\n2.MOUNTモードでデータベースを起動する。'
	+ '\n3.RESTORE CONTROLFILEを実行して、バックアップ制御ファイルをリストアする。'
	+ '\n4.ALTER DATABASE MOUNTを実行してMOUNTモードに遷移する。'
	+ '\n5.ALTER DATABASE OPENを実行してデータベースをオープンする。'
	+ '\n6.ALTER DATABASE RESETLOGSを実行してデータベースをオープンする。'
	+ '\n7.RECOVER DATABASEを実行してデータベースをリカバリする。',
	'GOLD参考書65Pを参照'));
	pushChoice('1 → 3 → 4 → 7 → 6', true);
	pushChoice('2 → 3 → 4 → 7 → 6', false);
	pushChoice('1 → 3 → 4 → 5', false);
	pushChoice('2 → 3 → 4 → 5', false);
	pushChoice('1 → 3 → 5', false);
	pushChoice('2 → 3 → 6', false);
	sortChoice();
	
	// 106
	q_list.push(new Question('多重化された制御ファイルのうち、1つの制御ファイルが失われた場合の復旧手順として正しいものを選択しなさい。'
	+ '\nなお、複数の方法が存在する場合は、復旧による影響が最も少ないものを選ぶこと。',
	'GOLD参考書66Pを参照'));
	pushChoice('制御ファイルのバックアップをリストアする', false);
	pushChoice('正常な制御ファイルをコピーする', true);
	pushChoice('CREATE CONTROLFILE文を実行する', false);
	pushChoice('CONTROL_FILES初期化パラメータを変更する', false);
	sortChoice();
	
	// 107
	q_list.push(new Question('制御ファイルを新しい場所に移動する手段として正しいものを選択しなさい。'
	+ '\n現時点でインスタンスは起動中とします。'
	+ '\n'
	+ '\n1.OSのファイルコピーコマンドで制御ファイルを新しい場所にコピーする。'
	+ '\n2.NOMOUNTモードでデータベースを起動する。'
	+ '\n3.MOUNTモードでデータベースを起動する。'
	+ '\n4.通常のモードでデータベースを起動する。'
	+ '\n5.ALTER DATABASE MOUNTを実行してMOUNTモードに遷移する。'
	+ '\n6.ALTER DATABASE OPENを実行してデータベースをオープンする。'
	+ '\n7.ALTER SYSTEM SET CONTORL_FILES...SCOPE=SPFILEを実行して、CONTROL_FILES初期化パラメータを変更する。'
	+ '\n8.ALTER SYSTEM SET CONTORL_FILES...SCOPE=BOTHを実行して、CONTROL_FILES初期化パラメータを変更する。'
	+ '\n9.インスタンスを停止する。',
	'GOLD参考書67Pを参照'));
	pushChoice('8 → 9 → 1 → 4', false);
	pushChoice('7 → 9 → 1 → 4', true);
	pushChoice('9 → 1 → 2 → 7 → 5 → 6', false);
	pushChoice('9 → 1 → 2 → 4', false);
	pushChoice('9 → 1 → 3 → 7 → 5 → 6', false);
	pushChoice('9 → 1 → 3 → 4', false);
	sortChoice();
	
	// 108
	q_list.push(new Question('SPFILE、制御ファイルおよびすべてのデータファイルが失われた場合の復旧手順として正しいものを選択しなさい。'
	+ '\nなお、データベースはARCHIVELOGモードで運用されており、リカバリカタログは使用していないものとします。'
	+ '\n'
	+ '\n1.バックアップからSPFILEをリストアする。'
	+ '\n2.バックアップからPFILEをリストアする。'
	+ '\n3.リストアしたPFILEからSPFILEを作成する。'
	+ '\n4.仮のSPFILEを用いてNOMOUNTモードでインスタンスを起動する。'
	+ '\n5.リストアしたSPFILEを用いてインスタンスを再起動する。'
	+ '\n6.リストアしたPFILEを用いてインスタンスを再起動する。'
	+ '\n7.DBIDを設定する。'
	+ '\n8.RESTORE CONTROLFILEを実行して、バックアップ制御ファイルをリストアする。'
	+ '\n9.RECOVER CONTROLFILEを実行して、バックアップ制御ファイルをリカバリする。'
	+ '\n10.ALTER DATABASE MOUNTを実行してMOUNTモードに遷移する。'
	+ '\n11.ALTER DATABASE OPENを実行してデータベースをオープンする。'
	+ '\n12.ALTER DATABASE OPEN RESETLOGSを実行してデータベースをオープンする。'
	+ '\n13.RESTORE DATABASEを実行して、すべてのデータファイルをリストアする。'
	+ '\n14.RECOVER DATABASEを実行して、すべてのデータファイルをリカバリする。',
	'GOLD参考書68Pを参照'));
	pushChoice('4 → 7 → 1 → 5 → 8 → 10 → 13 → 14 → 11', false);
	pushChoice('4 → 7 → 1 → 5 → 8 → 10 → 13 → 14 → 12', true);
	pushChoice('4 → 7 → 1 → 5 → 8 → 10 → 13 → 12', false);
	pushChoice('4 → 7 → 1 → 5 → 8 → 9 → 10 → 13 → 14 → 11', false);
	pushChoice('4 → 7 → 1 → 5 → 8 → 9 → 10 → 13 → 14 → 12', false);
	pushChoice('4 → 7 → 1 → 5 → 8 → 9 → 10 → 13 → 14 ', false);
	sortChoice();
	
	// 109
	q_list.push(new Question('メディアリカバリにおいて、RESETLOGSオプション付きでのデータベースOPENが必要な状況をすべて選択しなさい。',
	'GOLD参考書70Pを参照'));
	pushChoice('不完全リカバリ実行時', true);
	pushChoice('完全リカバリ実行時', false);
	pushChoice('NOARCHIVELOGモードのデータベースでメディアリカバリが必要な障害が発生した場合', true);
	pushChoice('フラッシュバックデータベースを実行した場合', true);
	pushChoice('制御ファイルをリストアした場合', true);
	pushChoice('サーバーパラメータファイルをリストアした場合', false);
	sortChoice();
	
	// 110
	q_list.push(new Question('ディスク障害によりカレントのオンラインログファイルの全メンバーが破損し、インスタンスが強制終了されました。'
	+ '\n障害が発生したディスクは使用できないため、新しい場所にオンラインログファイルを配置する必要があります。'
	+ '\n復旧手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.RESTORE DATABASEを実行し、すべてのデータファイルをリストアする。'
	+ '\n2.RESTORE LOGFILEを実行し、破損したオンラインログファイルをリストアする。'
	+ '\n3.RECOVER DATABASEを実行し、完全リカバリを行う。'
	+ '\n4.破損していないオンラインログファイルのログ順序番号を復旧ターゲットに指定して、不完全リカバリを行う。'
	+ '\n5.ALTER DATABASE RENAME FILEを実行して、破損したオンラインログファイルを新しい場所に移動する。'
	+ '\n6.ALTER DATABASE OPENを実行して、データベースをOPENする。'
	+ '\n7.ALTER DATABASE OPEN RESETLOGSを実行して、データベースをOPENする。',
	'GOLD参考書70Pを参照'));
	pushChoice('1 → 4 → 5 → 6', false);
	pushChoice('1 → 2 → 4 → 5 → 6', false);
	pushChoice('1 → 4 → 6', false);
	pushChoice('1 → 2 → 4 → 7', false);
	pushChoice('1 → 4 → 5 → 7', true);
	pushChoice('1 → 2 → 4 → 5 → 7', false);
	sortChoice();
	
	// 111
	q_list.push(new Question('不完全リカバリを実行するためのコマンドとして正しいものを選択しなさい。'
	+ '\n復旧ターゲットはログ順序番号10とします。',
	'GOLD参考書71Pを参照'));
	pushChoice('RUN { SET UNTIL SEQUENCE=10; RESTORE DATABASE; RECOVER DATABASE; }', true);
	pushChoice('RUN { UNTIL SEQUENCE=10; RESTORE DATABASE; RECOVER DATABASE; }', false);
	pushChoice('RESTORE DATABASE; RECOVER DATABASE UNTIL SEQUENCE=10;', false);
	pushChoice('RUN { RESTORE DATABASE; RECOVER DATABASE UNTIL SEQUENCE=10; }', false);
	sortChoice();
	
	// 112
	q_list.push(new Question('表のリカバリに関する説明として正しいものをすべて選択しなさい。',
	'GOLD参考書73Pを参照'));
	pushChoice('復旧ターゲットに対応するバックアップが必要である', true);
	pushChoice('ターゲットデータベースはARCHIVELOGモードである必要がある', true);
	pushChoice('ターゲットデータベースはMOUNTモードで起動している必要がある', false);
	pushChoice('SYSスキーマの表に対して表リカバリを実行できない', true);
	pushChoice('SYSTEM表領域およびSYSAUX表領域の表に対して表リカバリを実行できない', true);
	pushChoice('リカバリ対象の表に作成されていた制約と索引は常にインポートされない', false);
	sortChoice();
	
	// 113
	q_list.push(new Question('表のリカバリを実行したときに内部的に使用される構成要素として正しいものをすべて選択しなさい。',
	'GOLD参考書73Pを参照'));
	pushChoice('復旧ターゲット近辺で実行されていた更新処理を特定するための、サプリメンタルロギングで出力されたREDOデータ', false);
	pushChoice('復旧ターゲット時点のデータを得るための、ターゲットデータベースのバックアップ', true);
	pushChoice('AUXILIARY DESTINATIONに作成された補助インスタンス', true);
	pushChoice('リカバリ対象の表が含まれるData Pumpダンプファイル', true);
	pushChoice('補助インスタンスから表領域をトランスポートするためのデータファイル', false);
	sortChoice();
	
	// 114
	q_list.push(new Question('RMANからテープ装置へバックアップを取得する処理についての説明として正しいものを2つ選択しなさい。',
	'GOLD参考書75Pを参照'));
	pushChoice('RMANからテープ装置へバックアップを取得するためには使用するテープ装置に対応したメディア管理ライブラリ（MML）の導入が必要である', true);
	pushChoice('バックアップセット形式およびイメージコピー形式の両方でバックアップを取得できる', false);
	pushChoice('デフォルトのバックアップ出力先をテープ装置にするためには、CONFIGURE DEFAULT DEVICE TYPE TO TAPE; を実行する', false);
	pushChoice('メディア管理ライブラリ（MML)のファイルパスをSBT_LIBRARYに設定する', true);
	sortChoice();
	
	// 115
	q_list.push(new Question('Oracle Secure Backupの特徴に関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書76Pを参照'));
	pushChoice('データベースの破損状況の確認、破損修復スクリプトの生成、修復作業の実行を自動化できる', false);
	pushChoice('バックアップの暗号化に対応している', true);
	pushChoice('テープ装置へのバックアップに必要なメディア管理ライブラリ（MML）を提供する', true);
	pushChoice('フラッシュバックログを用いてデータベースを過去の状態に戻すことができる', false);
	pushChoice('ファイルシステムをファイル、ディレクトリ、ファイルシステムまたはRAWパーティションといった様々なレベルでバックアップできる', true);
	sortChoice();
	
	// 116
	q_list.push(new Question('デフォルトのバックアップ先としてテープ装置を利用するとします。'
	+ '\nOracle Secure Backupでテープ装置へのバックアップを取得するための構成手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.Oracle Secure Backupをインストールする。'
	+ '\n2.Oracle社のWebサイトからSBTライブラリをダウンロードして配置する'
	+ '\n3.Oracle Secure Backupを提供するSBTライブラリが導入されていることを確認する'
	+ '\n4.RMANを実行するOSユーザーに対して、Oracle Secure Backupを用いたバックアップに必要な権限を事前認可する。'
	+ '\n5.RMANバックアップ用のメディアファミリを作成する。'
	+ '\n6.テープ装置用のチャネル設定で、SBT_LIBRARYを用いてSBTライブラリの場所を指定する。'
	+ '\n7.テープ装置用のチャネル設定で、OB_IGNORE_NUMA=0を指定し、NUMA対応を無効化する。'
	+ '\n8.テープ装置用のチャネル設定で、OB_MEDIA_FAMILYを用いてメディアファミリ名を指定する。',
	'GOLD参考書76Pを参照'));
	pushChoice('1 → 2 → 4 → 5 → 7 → 8', false);
	pushChoice('1 → 2 → 4 → 5 → 6 → 7 → 8', false);
	pushChoice('1 → 3 → 5 → 7 → 8', false);
	pushChoice('1 → 2 → 5 → 7 → 8', false);
	pushChoice('1 → 3 → 4 → 5 → 7 → 8', true);
	pushChoice('1 → 3 → 4 → 5 → 6 → 7 → 8', false);
	sortChoice();
	
	// 117
	q_list.push(new Question('UNDO表領域の構成に関する説明として正しいものを選択しなさい。',
	'GOLD参考書78Pを参照'));
	pushChoice('初期化パラメータUNDO_RETENTIONにUNDOの保存期間を設定する', true);
	pushChoice('初期化パラメータUNDO_RETENTION_GUARANTEEにUNDO保存を保証するかを設定する', false);
	pushChoice('古いデータを参照するフラッシュバック操作を実行したときに、対応するUNDOデータがないと、アーカイブログファイルから古いデータを取得し結果を返す', false);
	pushChoice('自動UNDO管理を使用する場合、初期化パラメータUNDO_TABLESPACEに"AUTO"を設定する', false);
	sortChoice();
	
	// 118
	q_list.push(new Question('UNDO表領域が固定サイズの場合におけるUNDO保存の動作に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書79Pを参照'));
	pushChoice('UNDO保存保証が有効でない場合、UNDO表領域にUNDOデータを保管する空き領域が不足すると、UNDO_RETENTIONで指定された保存期間内であったとしても、古いUNDOデータが上書きされる', true);
	pushChoice('UNDO保存保証が有効でない場合、UNDO表領域にUNDOデータを保管する空き領域が不足すると、UNDO表領域のサイズが拡張することで、UNDO_RETENTIONで指定された保存期間内のUNDOデータが上書きされないようにする', false);
	pushChoice('UNDO保存保証が有効な場合、保存期間内のUNDOデータは保存される。ただし、更新処理がエラーで失敗する場合がある', true);
	pushChoice('UNDO保存保証が有効な場合、UNDO表領域にUNDOデータを保管する空き領域が不足すると、UNDO表領域のサイズが拡張することで、UNDO_RETENTIONで指定された保存期間内のUNDOデータが上書きされないようにする', false);
	sortChoice();
	
	// 119
	q_list.push(new Question('フラッシュバック問い合わせの特徴に関する説明として正しいものを選択しなさい。',
	'GOLD参考書80Pを参照'));
	pushChoice('問い合わせに必要な過去のデータをUNDO表領域のUNDOデータから取得する', true);
	pushChoice('過去実行された更新処理を確認でき、あわせて、その更新処理を打ち消すSQLを取得できる', false);
	pushChoice('表のデータを過去の指定した時点の状態に戻すことができる', false);
	pushChoice('指定した期間内における、行のすべてのバージョン履歴を確認できる', false);
	sortChoice();
	
	// 120
	q_list.push(new Question('テーブルt1の過去のデータを参照したいと考えています。'
	+ '\n(X)に入るキーワードとして適切なものを選択しなさい。'
	+ '\n'
	+ '\nSELECT * FROM t1'
	+ '\n  (X) TIMESTAMP TO_TIMESTAMP("18-01-25 20:46;51")'
	+ '\n  WHERE n=1;',
	'GOLD参考書80Pを参照'));
	pushChoice('WHEN', false);
	pushChoice('AS OF', true);
	pushChoice('TIME OF', false);
	pushChoice('IN TIME OF', false);
	sortChoice();
	
	// 121
	q_list.push(new Question('フラッシュバックバージョン問い合わせの特徴に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書81Pを参照'));
	pushChoice('問い合わせ実行に必要な過去のデータをフラッシュバックログから取得する', false);
	pushChoice('VERSIONS BETWEEN句で指定した期間内において、過去実行された更新処理を確認でき、あわせて、その更新処理を打ち消すSQLを取得できる', false);
	pushChoice('VERSIONS BETWEEN句で指定した期間内における、行のすべてのバージョン履歴を確認できる', true);
	pushChoice('FLASHBACK_VERSION_QUERYビューから、VERSIONS BETWEEN句で指定した期間内におけるバージョン履歴を確認できる', false);
	pushChoice('対象の表に、表の構造を変更するDDLを実行すると、DDL実行より前のデータは確認できなくなる', true);
	sortChoice();
	
	// 122
	q_list.push(new Question('フラッシュバックバージョン問い合わせで使用できる疑似列の組み合わせとして正しいものを選択しなさい。',
	'GOLD参考書81Pを参照'));
	pushChoice('VERSIONS_STARTSCN、VERSIONS_ENDSCN、VERSIONS_OPERATION', true);
	pushChoice('VERSIONS_STARTSCN、VERSIONS_ENDSCN、UNDOSQL', false);
	pushChoice('VERSIONS_STARTTIME、VERSIONS_ENDTIME、ORIGINAL_NAME', false);
	pushChoice('VERSIONS_STARTTIME、VERSIONS_ENDTIME、UNDO_SQL', false);
	sortChoice();
	
	// 123
	q_list.push(new Question('フラッシュバックトランザクション問い合わせの特徴に関する説明として正しいものを選択しなさい。',
	'GOLD参考書82Pを参照'));
	pushChoice('VERSIONS BETWEEN句で指定した期間内における、行のすべてのバージョン履歴を確認できる', false);
	pushChoice('FLASHBACK_TRANSACTION_QUERYビューから過去実行された更新処理、および、その更新処理を打ち消すSQLを取得できる', true);
	pushChoice('表のデータを過去の指定した時点に戻すことができる', false);
	pushChoice('トランザクションの依存関係を分析し、指定された方法でトランザクションを取り消すことができる', false);
	sortChoice();
	
	// 124
	q_list.push(new Question('フラッシュバックトランザクション問い合わせを使用するための前提条件として正しいものを2つ選択しなさい。',
	'GOLD参考書83Pを参照'));
	pushChoice('最小サプリメンタル・ロギングの有効化', true);
	pushChoice('アーカイブログモードでの運用', false);
	pushChoice('高速リカバリ領域の構成', false);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するSELECT ANY TRANSACTIONシステム権限', true);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するFLASHBACK ANY TABLEシステム権限', false);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するDBMS_FLASHBACKパッケージのEXECUTE権限', false);
	sortChoice();
	
	// 125
	q_list.push(new Question('フラッシュバックトランザクション問い合わせを使用するための前提条件として正しいものを2つ選択しなさい。',
	'GOLD参考書83Pを参照'));
	pushChoice('最小サプリメンタル・ロギングの有効化', true);
	pushChoice('アーカイブログモードでの運用', false);
	pushChoice('高速リカバリ領域の構成', false);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するSELECT ANY TRANSACTIONシステム権限', true);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するFLASHBACK ANY TABLEシステム権限', false);
	pushChoice('フラッシュバックトランザクション問い合わせを実行するユーザーに対するDBMS_FLASHBACKパッケージのEXECUTE権限', false);
	sortChoice();
	
	// 126
	q_list.push(new Question('フラッシュバックデータアーカイブの特徴に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書84Pを参照'));
	pushChoice('UNDOデータのアーカイブ機能を有効にして、UNDO表領域に多くのUNDOデータを保管できるようにする', false);
	pushChoice('永続表領域に履歴格納用のフラッシュバックデータアーカイブを構成することで、長期間の履歴データを保持できる', true);
	pushChoice('フラッシュバックデータアーカイブ作成時、履歴データの保持期限を示すRETENTION句の指定は必須である', true);
	pushChoice('フラッシュバックデータアーカイブ作成時、領域割り当て制限を示すQUOTA句の指定は必須である', false);
	pushChoice('フラッシュバックデータアーカイブが有効化されている表の名前を変更することはできない', false);
	pushChoice('フラッシュバックデータアーカイブが有効化されている表の列を削除することはできない', false);
	sortChoice();
	
	// 127
	q_list.push(new Question('フラッシュバックデータアーカイブを構成し、年単位など非常に古いデータをフラッシュバック問い合わせできるようにする手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.フラッシュバックデータアーカイブ用に自動セグメント領域管理方式の表領域を作成する。'
	+ '\n2.フラッシュバックデータアーカイブ用に手動セグメント領域管理方式の表領域を作成する。'
	+ '\n3.フラッシュバックデータアーカイブ用の表領域にフラッシュバックデータアーカイブを作成する。'
	+ '\n4.データベースのSYSAUX表領域にフラッシュバックデータアーカイブを作成する。'
	+ '\n5.履歴を保存したい表に対してフラッシュバックデータアーカイブを有効化する。'
	+ '\n6.フラッシュバック問い合わせを実行するユーザーに対して、フラッシュバックデータアーカイブへの参照権限を付与する。',
	'GOLD参考書85Pを参照'));
	pushChoice('2 → 3 → 5', false);
	pushChoice('2 → 3 → 6', false);
	pushChoice('1 → 3 → 5', true);
	pushChoice('1 → 3 → 6', false);
	pushChoice('4 → 5', false);
	pushChoice('4 → 6', false);
	sortChoice();
	
	// 128
	q_list.push(new Question('フラッシュバック表を用いて表を過去の状態に戻す場合に、復旧ターゲットから現在までの間で実行することが許されないSQLをすべて選択しなさい。',
	'GOLD参考書86Pを参照'));
	pushChoice('DML(UPDATE、INSERT、DELETE)', false);
	pushChoice('TRUNCATE TABLE文', true);
	pushChoice('DROP TABLE文', true);
	pushChoice('ALTER TABLE文', true);
	sortChoice();
	
	// 129
	q_list.push(new Question('フラッシュバックトランザクションを使用するための前提条件として正しいものをすべて選択しなさい。',
	'GOLD参考書86Pを参照'));
	pushChoice('ARCHIVELOGモードであること', true);
	pushChoice('UNDO保存保証が有効なこと', false);
	pushChoice('高速リカバリ領域が構成されていること', false);
	pushChoice('最小および主キーサプリメンタルロギングが有効になっていること', true);
	pushChoice('フラッシュバックトランザクションの実行ユーザーにDBMS_FLASHBACKパッケージの実行権限があること', true);
	pushChoice('フラッシュバックトランザクションの実行ユーザーにSELECT ANY TRANSACTIONシステム権限があること', true);
	sortChoice();
	
	// 130
	q_list.push(new Question('フラッシュバックトランザクションでバックアウト処理を行うDBMS_FLASHBACK.TRANSACTION_BACKOUTにおいて、デフォルトでの依存トランザクションの取り扱いとして正しいものを選択しなさい。',
	'GOLD参考書87Pを参照'));
	pushChoice('依存トランザクションを無視して、取り消し対象のトランザクションだけをバックアウトする', false);
	pushChoice('依存トランザクションが更新していない行についてのみ、バックアウトする', false);
	pushChoice('依存トランザクションを含めたすべてのトランザクションを、実際に実行された順序とは逆の順序でバックアウトする', false);
	pushChoice('依存トランザクションが存在する場合、バックアウト処理がエラーで失敗する', true);
	sortChoice();
	
	// 131
	q_list.push(new Question('RECYCLEBINに同じ表について削除済み表が2つ存在します。'
	+ '\nこれらの削除済み表が作成される原因となった操作について、適切に説明しなさい。'
	+ '\n'
	+ '\nSQL> SHOW RECYCLEBIN;'
	+ '\n'
	+ '\nORIGINAL NAME    RECYCLEBIN NAME                OBJECT TYPE DROP TIME'
	+ '\n---------------- ------------------------------ ----------- -------------------'
	+ '\nTAB0             BIN$IORgDWPvRSfgUwEPH6xG6Q==$0 TABLE       2018-01-29:23:13:37'
	+ '\nTAB0             BIN$IORgDWPvRSfgUwEPH6xG6Q==$0 TABLE       2018-01-29:23:13:33',
	'GOLD参考書88Pを参照'));
	pushChoice('異なるユーザーが所有する同じ名前の表の削除済み表が表示されている', false);
	pushChoice('1つの削除済み表の実体は表であり、もう1つの削除済み表の実体は表の索引である', false);
	pushChoice('2つのパーティションから構成されるパーティション表を削除した', false);
	pushChoice('同じ名前の表を2回削除した', true);
	sortChoice();
	
	// 132
	q_list.push(new Question('フラッシュバックドロップを用いて、索引、トリガー、制約が付けられた表を復元しました。'
	+ '\n表と一緒に復元されるものをすべて選択しなさい。',
	'GOLD参考書89Pを参照'));
	pushChoice('表定義', true);
	pushChoice('表に格納されたデータ', true);
	pushChoice('索引', true);
	pushChoice('トリガー', true);
	pushChoice('制約', true);
	sortChoice();
	
	// 133
	q_list.push(new Question('フラッシュバックロギングを有効化（フラッシュバックデータベースを有効化）する前に必要な設定を2つ選択しなさい。',
	'GOLD参考書90Pを参照'));
	pushChoice('サプリメンタルロギングの有効化', false);
	pushChoice('ARCHIVELOGモード運用の設定', true);
	pushChoice('高速リカバリ領域の構成', true);
	pushChoice('UNDO保証の構成', false);
	pushChoice('RMAN保存ポリシーの指定', false);
	sortChoice();
	
	// 134
	q_list.push(new Question('フラッシュバックデータベースの実行手順として正しいものを選択しなさい。'
	+ '\n'
	+ '\n1.補助インスタンスを起動する。'
	+ '\n2.復旧ターゲットを指定したFLASHBACK DATABASE文を実行する。'
	+ '\n3.復旧ターゲットの指定とデータベース全体のリストアおよびリカバリを実行するRMAN RUNブロックを実行する。'
	+ '\n4.データベースをMOUNT状態にする。'
	+ '\n5.RESETLOGSオプションを指定してデータベースをOPENする。'
	+ '\n6.RESETLOGSオプションを指定せずデータベースをOPENする。',
	'GOLD参考書90Pを参照'));
	pushChoice('1 → 4 → 2 → 5', false);
	pushChoice('1 → 4 → 2 → 6', false);
	pushChoice('4 → 2 → 5', true);
	pushChoice('4 → 2 → 6', false);
	pushChoice('3 → 2 → 5', false);
	pushChoice('3 → 2 → 6', false);
	sortChoice();
	
	// 135
	q_list.push(new Question('フラッシュバックデータベースの復旧ターゲットに関する説明として正しいものを選択しなさい。',
	'GOLD参考書91Pを参照'));
	pushChoice('DB_FLASHBACK_RETENTION_TARGET初期化パラメータに設定したフラッシュバックログ保存期間内であれば、フラッシュバックデータベースは必ず成功する', false);
	pushChoice('UNDO保存保証をONに設定していれば、UNDO_RETENTION初期化パラメータの設定時間内へのフラッシュバックデータベースは必ず成功する', false);
	pushChoice('保証付きリストアポイントに対応する時点へのフラッシュバックデータベースは必ず成功する', true);
	pushChoice('保証付きリストアポイントに対応する時点以降へのフラッシュバックデータベースは必ず成功する', false);
	sortChoice();
	
	// 136
	q_list.push(new Question('フラッシュバックデータベースに失敗する状況をすべて選択しなさい。',
	'GOLD参考書92Pを参照'));
	pushChoice('データファイルが破損している場合', true);
	pushChoice('データファイルのサイズが縮小されている場合', true);
	pushChoice('制御ファイルがリストアされている場合', true);
	pushChoice('データベースがRESETLOGSオプションでOPENされている場合', false);
	pushChoice('復旧ターゲットに対応するバックアップが存在しない場合', false);
	sortChoice();
	
	// 137
	q_list.push(new Question('保証付きリストアポイントを作成する前に必要な設定を3つ選択しなさい。',
	'GOLD参考書93Pを参照'));
	pushChoice('サプリメンタルロギングの有効化', false);
	pushChoice('ARCHIVELOGモード運用の設定', true);
	pushChoice('高速リカバリ領域の構成', true);
	pushChoice('UNDO保証の構成', false);
	pushChoice('RMAN保存ポリシーの指定', false);
	pushChoice('COMPATIBLE初期化パラメータを10.2以上に設定', true);
	sortChoice();
	
	// 138
	q_list.push(new Question('Data Pumpを用いたトランスポータブル表領域の手順として正しいものを選択しなさい。'
	+ '\n移行元のデータベースと移行先のデータベースのプラットフォームおよびキャラクタセットは同一であるとします。'
	+ '\n'
	+ '\n1.RMANでDUPLICATE TABLESPACEコマンドを実行し、トランスポータブル用の複製データベースを作成する。'
	+ '\n2.RMANでTRANSPORT TABLESPACEコマンドを実行し、データファイルとメタデータのダンプファイルを作成する。'
	+ '\n3.移行元データベースで、転送対象の表領域を読み取り専用に変更する。'
	+ '\n4.転送対象の表領域を構成するデータファイルを移行先にコピーする。'
	+ '\n5.移行先のデータベースのプラットフォームに合わせてデータファイルをRMANで変換する。'
	+ '\n6.移行元のデータベースで、Data Pumpをを用いてメタデータをエクスポートする。'
	+ '\n7.メタデータを移行先にコピーする。'
	+ '\n8.移行先データベースで、Data Pumpを用いてメタデータをインポートする。'
	+ '\n9.移行先データベースで、転送した表領域を読み取り／書き込みモードにする。',
	'GOLD参考書94Pを参照'));
	pushChoice('2 → 6 → 7 → 8 → 9', false);
	pushChoice('3 → 6 → 4 → 7 → 8 → 9', true);
	pushChoice('1 → 6 → 4 → 7 → 8 → 9', false);
	pushChoice('2 → 6 → 7 → 5 → 8 → 9', false);
	pushChoice('3 → 6 → 4 → 7 → 5 → 8 → 9', false);
	pushChoice('1 → 6 → 4 → 7 → 5 → 8 → 9', false);
	sortChoice();
	
	// 139
	q_list.push(new Question('RMANを用いたトランスポータブル表領域の手順として正しいものを選択しなさい。'
	+ '\n移行元のデータベースと移行先のデータベースのプラットフォームおよびキャラクタセットは同一であるとします。'
	+ '\n'
	+ '\n1.RMANでDUPLICATE TABLESPACEコマンドを実行し、トランスポータブル用の複製データベースを作成する。'
	+ '\n2.RMANでTRANSPORT TABLESPACEコマンドを実行し、データファイルとメタデータのダンプファイルを作成する。'
	+ '\n3.移行元データベースで、転送対象の表領域を読み取り専用に変更する。'
	+ '\n4.転送対象の表領域を構成するデータファイルを移行先にコピーする。'
	+ '\n5.移行元データベースで、Data Pumpを用いてメタデータをエクスポートする。'
	+ '\n6.メタデータを移行先にコピーする。'
	+ '\n7.移行先で補助インスタンスを作成し、データファイル一貫性のある状態に変換する。'
	+ '\n8.移行先データベースで、Data Pumpを用いてメタデータをインポートする。'
	+ '\n9.移行先データベースで、転送した表領域を読み取り／書き込みモードにする。',
	'GOLD参考書95Pを参照'));
	pushChoice('3 → 2 → 4 → 6 → 8 → 9', false);
	pushChoice('3 → 1 → 4 → 6 → 8 → 9', false);
	pushChoice('2 → 4 → 6 → 7 → 8 → 9', false);
	pushChoice('1 → 4 → 6 → 7 → 8 → 9', false);
	pushChoice('2 → 4 → 6 → 8 → 9', true);
	pushChoice('1 → 4 → 6 → 8 → 9', false);
	sortChoice();
	
	// 140
	q_list.push(new Question('トランスポータブル表領域の前提条件や制限のうち、正しいものをすべて選択しなさい。',
	'GOLD参考書97Pを参照'));
	pushChoice('ソースデータベースとターゲットデータベースは同じまたは上位互換の関係にあるキャラクタセットである必要がある', true);
	pushChoice('転送対象の表領域は自動セグメント領域管理方式（ASSM）を使用している必要がある', false);
	pushChoice('表とその表の索引が別の表領域に格納されている場合、それらの表領域は1回のトランスポータブル表領域の実行で一緒に転送できず、表領域ごとに複数回トランスポータブル表領域を実行する必要がある', false);
	pushChoice('SYSTEM表領域はトランスポータブル表領域で転送できない', true);
	pushChoice('SYSAUX表領域はトランスポータブル表領域で転送できない', true);
	pushChoice('BIGFILE表領域はトランスポータブル表領域で転送できない', false);
	pushChoice('暗号化された表領域はトランスポータブル表領域で転送できない', true);
	sortChoice();
	
	// 141
	q_list.push(new Question('イメージコピーを用いたトランスポータブル表領域の手順として正しいものを選択しなさい。'
	+ '\nなお、環境などの条件は以下の通りです。'
	+ '\n'
	+ '\n移行元のデータベースのプラットフォーム："Solaros[tm]OE(64-bit)"'
	+ '\n移行先のデータベースのプラットフォーム："Linux x86 64-bit"'
	+ '\n移行元のデータベースと移行先のデータベースのキャラクタセット：同一'
	+ '\nデータファイルのエンディアン変換：移行先のデータベースで実行'
	+ '\n'
	+ '\n1.RMANでCROSS TRANSPORT TABLESPACEコマンドを実行し、データファイルとメタデータのダンプファイルを作成する。'
	+ '\n2.移行元データベースで、転送対象の表領域を読み取り専用に変更する。'
	+ '\n3.転送対象の表領域を構成するデータファイルを移行先にコピーする。'
	+ '\n4.移行元データベースで、Data Pumpを用いてメタデータをエクスポートする。'
	+ '\n5.メタデータを移行先にコピーする。'
	+ '\n6.RMANでCONVERT TABLESPACEコマンドを実行し、データファイルを移行先データベースのプラットフォームに合わせて変換する。'
	+ '\n7.RMANでCONVERT DATAFILEコマンドを実行し、データファイルを移行先データベースのプラットフォームに合わせて変換する。'
	+ '\n8.メタデータを移行先データベースのプラットフォームに合わせて変換する。'
	+ '\n9.移行先データベースで、Data Pumpを用いてメタデータをインポートする。'
	+ '\n10.移行先データベースで、転送した表領域を読み取り／書き込みモードにする。',
	'GOLD参考書98Pを参照'));
	pushChoice('2 → 4 → 3 → 5 → 7 → 9 → 10', true);
	pushChoice('1 → 4 → 3 → 5 → 7 → 9 → 10', false);
	pushChoice('2 → 4 → 3 → 5 → 6 → 9 → 10', false);
	pushChoice('1 → 4 → 3 → 5 → 6 → 9 → 10', false);
	pushChoice('2 → 4 → 3 → 5 → 6 → 8 → 9 → 10', false);
	pushChoice('1 → 4 → 3 → 5 → 6 → 8 → 9 → 10', false);
	sortChoice();
	
	// 142
	q_list.push(new Question('バックアップセットを用いたトランスポータブル表領域の手順として正しいものを選択しなさい。'
	+ '\nなお、環境などの条件は以下の通りです。'
	+ '\n'
	+ '\n移行元のデータベースのプラットフォーム："Solaros[tm]OE(64-bit)"'
	+ '\n移行先のデータベースのプラットフォーム："Linux x86 64-bit"'
	+ '\n移行元のデータベースと移行先のデータベースのキャラクタセット：同一'
	+ '\nデータファイルのエンディアン変換：移行元のデータベースで実行'
	+ '\n'
	+ '\n1.移行元データベースで、転送対象の表領域を読み取り専用に変更する。'
	+ '\n2.RMANでCONVERT TABLESPACEコマンドを実行し、データファイルを移行先データベースのプラットフォームに合わせて変換する。'
	+ '\n3.RMANでBACKUP TO PLATFORMコマンドを実行し、バックアップセットの作成を行う。'
	+ '\n4.RMANでBACKUP TO PLATFORMコマンドを実行し、バックアップセットの作成とメタデータのエクスポートを行う。'
	+ '\n5.転送対象のバックアップセットを移行先にコピーする。'
	+ '\n6.移行元データベースで、Data Pumpを用いてメタデータをエクスポートする。'
	+ '\n7.メタデータを移行先にコピーする。'
	+ '\n8.移行先データベースで、Data Pumpを用いてメタデータをインポートする。'
	+ '\n9.移行先データベースで、転送した表領域を読み取り／書き込みモードにする。'
	+ '\n10.RMANでRESTORE FOREIGN TABLESPACEコマンドを実行して、データファイルのリストアとメタデータのインポートを行う。'
	+ '\n11.RMANでRESTORE FOREIGN TABLESPACEコマンドを実行して、データファイルのリストアを行う。',
	'GOLD参考書99Pを参照'));
	pushChoice('1 → 3 → 5 → 6 → 7 → 10 → 9', false);
	pushChoice('1 → 4 → 5 → 7 → 10 → 9', true);
	pushChoice('1 → 3 → 5 → 6 → 7 → 11 → 8 → 9', false);
	pushChoice('1 → 4 → 5 → 7 → 11 → 8 → 9', false);
	pushChoice('1 → 2 → 3 → 5 → 6 → 7 → 10 → 9', false);
	pushChoice('1 → 2 → 4 → 5 → 7 → 10 → 9', false);
	sortChoice();
	
	// 143
	q_list.push(new Question('エンディアンが異なるプラットフォーム間でのトランスポータブル表領域の前提条件や制限として正しいものをすべて選択しなさい。',
	'GOLD参考書101Pを参照'));
	pushChoice('ソースデータベースとターゲットデータベースは同じまたは上位互換の関係にあるキャラクタセットである必要がある', true);
	pushChoice('SYSAUX表領域はトランスポータブル表領域では転送できない', true);
	pushChoice('暗号化された表領域はトランスポータブル表領域では転送できない', true);
	pushChoice('COMPATIBLE初期化パラメータは10.0.0以上である必要がある', true);
	pushChoice('バックアップセットによるクロスプラットフォーム表領域の場合、エンディアン変換は移行元のデータベースで実現する必要がある', false);
	sortChoice();
	
	// 144
	q_list.push(new Question('バックアップベースのデータベース複製を行う手順として正しいものを選択しなさい。'
	+ '\nなお、手順が複数存在する場合は、可用性や手順の簡単さの点で最も優れた手順を選ぶこと。'
	+ '\n'
	+ '\n1.RMANクライアントからソースデータベースにはTARGETとして、補助インスタンスにはCATALOGとして接続する。'
	+ '\n2.RMANクライアントからソースデータベースにはTARGETとして、補助インスタンスにはAUXILIARYとして接続する。'
	+ '\n3.RMANのDUPLICATE TARGET DATABASEコマンドを実行し、データベースを複製する。'
	+ '\n4.複製元データベースでバックアップを取得する。'
	+ '\n5.複製元データベースをSHUTDOWNし、一貫性バックアップを取得する。'
	+ '\n6.複製先ホストに複製元データベースのSPFILEをコピーする。'
	+ '\n7.複製先ホストで補助インスタンスを起動する。'
	+ '\n8.補助インスタンスにリモート接続できるように構成する。'
	+ '\n9.複製先ホストにバックアップファイルやアーカイブログファイルをコピーする。',
	'GOLD参考書102Pを参照'));
	pushChoice('4 → 7 → 6 → 8 → 9 → 1 → 3', false);
	pushChoice('5 → 7 → 6 → 8 → 9 → 2 → 3', false);
	pushChoice('4 → 7 → 8 → 9 → 2 → 3', true);
	pushChoice('5 → 7 → 8 → 9 → 2 → 3', false);
	pushChoice('4 → 7 → 8 → 9 → 1 → 3', false);
	pushChoice('5 → 7 → 8 → 9 → 1 → 3', false);
	sortChoice();
	
	// 145
	q_list.push(new Question('DUPLICATE TARGET DATABASEコマンドに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書103Pを参照'));
	pushChoice('複製元データベースと複製先データベースのファイル構成を同一にしたい場合、NOFILENAMECHECK句を必ず指定する必要がある', true);
	pushChoice('サーバーパラメータファイルの複製が可能だが、複製元データベースと複製データベースの設定値が同一となる制限がある', false);
	pushChoice('PARAMETER_VALUE_CONVERT句を指定すると、複製元データベースの初期化パラメータ設定と複製先の環境に応じてOracleが自動的に変換してくれる', false);
	pushChoice('SET UNTIL句を指定すると、複製元のデータベースを過去のある時点の状態として作成する', true);
	sortChoice();
	
	// 146
	q_list.push(new Question('アクティブなデータベース複製を行う手順として正しいものを選択しなさい。'
	+ '\nなお、手順が複数存在する場合は、可用性や手順の簡単さの点で最も優れた手順を選ぶこと。'
	+ '\n'
	+ '\n1.RMANクライアントからソースデータベースにはTARGETとして、補助インスタンスにはAUXILIARYとして接続する。'
	+ '\n2.RMANのDUPLICATE TARGET ACTIVE DATABASEコマンドを実行し、データベースを複製する。'
	+ '\n3.RMANのDUPLICATE TARGET ACTIVE DATABASE...FROM ACTIVE DATABASEコマンドを実行し、データベースを複製する。'
	+ '\n4.複製元データベースでバックアップを取得する。'
	+ '\n5.複製先ホストで補助インスタンスを起動する。'
	+ '\n6.補助インスタンスにリモート接続できるように構成する。'
	+ '\n7.複製先ホストにバックアップファイルやアーカイブログファイルをコピーする。',
	'GOLD参考書104Pを参照'));
	pushChoice('4 → 5 → 6 → 7 → 1 → 3', false);
	pushChoice('4 → 5 → 6 → 1 → 3', false);
	pushChoice('5 → 6 → 1 → 3', true);
	pushChoice('4 → 5 → 6 → 7 → 1 → 2', false);
	pushChoice('4 → 5 → 6 → 1 → 2', false);
	pushChoice('5 → 6 → 1 → 2', false);
	sortChoice();
	
	// 147
	q_list.push(new Question('Oracle Database 12cの新機能のバックアップセットを使用したアクティブデータベースの複製が実行される条件を3つ選択しなさい。',
	'GOLD参考書105Pを参照'));
	pushChoice('DUPLICATE...FROM ACTIVE DATABASEコマンドにUSING BACKUPSET句が指定されている場合', true);
	pushChoice('DUPLICATE...FROM ACTIVE DATABASEコマンドの前にSET ENCRYPTIONが指定されている場合', true);
	pushChoice('複製元データベースを停止してからアクティブなデータベースの複製を実行した場合', false);
	pushChoice('割り当てられた補助チャネルの数がターゲットチャネルの数と同じか、大きい場合', true);
	pushChoice('複製元のデータベースであらかじめバックアップセット形式でバックアップを取得してある状態でアクティブなデータベースの複製を実行した場合', false);
	sortChoice();
	
	// 148
	q_list.push(new Question('複製データベース（複製して作成されたデータベース）とバックアップをリストアしたデータベース（バックアップを新しいホストへリストア／リカバリして作成されたデータベース）のDBIDについて正しいものを選択しなさい。',
	'GOLD参考書106Pを参照'));
	pushChoice('複製データベース：元のデータベースと同じ、バックアップをリストアしたデータベース：元のデータベースと同じ', false);
	pushChoice('複製データベース：元のデータベースと異なる、バックアップをリストアしたデータベース：元のデータベースと同じ', true);
	pushChoice('複製データベース：元のデータベースと同じ、バックアップをリストアしたデータベース：元のデータベースと異なる', false);
	pushChoice('複製データベース：元のデータベースと異なる、バックアップをリストアしたデータベース：元のデータベースと異なる', false);
	sortChoice();
	
	// 149
	q_list.push(new Question('チャネルによって実行されるRMANのバックアップやリカバリ処理状況を監視するため有用な動的パフォーマンスビューを選択しなさい。',
	'GOLD参考書107Pを参照'));
	pushChoice('V$CHANNEL', false);
	pushChoice('V$SESSION_LONGOPS', true);
	pushChoice('V$SESSION_CHANNEL', false);
	pushChoice('V$RMAN_CHANNEL', false);
	sortChoice();
	
	// 150
	q_list.push(new Question('以下のRMANバックアップ機能のうち、ストレージI/O量削減に役立つ機能をすべて選択しなさい。',
	'GOLD参考書107Pを参照'));
	pushChoice('高速増分バックアップ', true);
	pushChoice('増分バックアップ', true);
	pushChoice('パラレルバックアップ', false);
	pushChoice('圧縮バックアップ', true);
	pushChoice('イメージコピー形式でのバックアップ', false);
	pushChoice('バックアップセット形式でのバックアップ', true);
	sortChoice();
	
	// 151
	q_list.push(new Question('RMANによるバックアップやリストアが、非同期I/Oで実行されているかを確認するために役立つ動的パフォーマンスビューを選択しなさい。',
	'GOLD参考書108Pを参照'));
	pushChoice('V$BACKUP_SYNC_IO', false);
	pushChoice('V$BACKUP_ASYNC_IO', true);
	pushChoice('V$DISK_SYNCH_IO', false);
	pushChoice('V$DISK_ASYNCH_IO', false);
	sortChoice();
	
	// 152
	q_list.push(new Question('ストリーミングテープドライブの特性を生かす目的で、書き込み対象のデータを常にテープに供給し続けることに有効な設定を2つ選択しなさい。',
	'GOLD参考書109Pを参照'));
	pushChoice('増分バックアップ形式でバックアップを取得する', false);
	pushChoice('リカバリカタログを使用する', false);
	pushChoice('MAXOPENFILESパラメータを大きな値に設定する', true);
	pushChoice('RATEパラメータを小さな値に設定する', false);
	pushChoice('BLKSIZEパラメータを大きな値に設定する', true);
	sortChoice();
	
	// 153
	q_list.push(new Question('テープ装置への非同期I/Oを用いたパフォーマンスの改善に関係する項目を2つ選択しなさい。',
	'GOLD参考書109Pを参照'));
	pushChoice('初期化パラメータBACKUP_TAPE_IO_SLAVESをtrueに設定する', true);
	pushChoice('初期化パラメータDISK_ASYNCH_IOをtrueに設定する', false);
	pushChoice('ラージプールに十分大きなサイズを割り当てる', true);
	pushChoice('REDOログバッファに十分大きなサイズを割り当てる', false);
	sortChoice();
	
	// 154
	q_list.push(new Question('アラートログに含まれる情報を3つ選択してください。',
	'SILVER参考書25Pを参照'));
	pushChoice('破損ブロックに関するエラー情報', true);
	pushChoice('メトリックしきい値を超えた場合の統計情報', false);
	pushChoice('チェックポイントの開始時間と終了時間', true);
	pushChoice('表に対するDROPやTRUNCATE情報', false);
	pushChoice('最後のベースライン作成後に行われた初期化パラメータの変更', true);
	sortChoice();
	
	// 155
	q_list.push(new Question('Oracle Database 12cのDDLログに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書29Pを参照'));
	pushChoice('テキスト形式とXML形式のファイルが存在する', true);
	pushChoice('デフォルトで生成される', false);
	pushChoice('DDL文と実行タイムスタンプが記録される', true);
	pushChoice('SYSユーザーによる実行は除外される', false);
	sortChoice();
	
	// 156
	q_list.push(new Question('MTTRアドバイザに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書103Pを参照'));
	pushChoice('現在のデータファイルサイズからかかるMTTR時間が計算される', false);
	pushChoice('FAST_START_MTTR_TARGET初期化パラメータが0の場合、使用することができない', true);
	pushChoice('V$INSTANCE_RECOVERビューで結果を確認することができる', false);
	pushChoice('MTTR時間に対するI/O量を見積もることができる', true);
	sortChoice();
	
	// 157
	q_list.push(new Question('次のコマンドに関する説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nSQL> ALTER DATABASE BACKUP CONTROLFILE TO TRACE;',
	'SILVER参考書116Pを参照'));
	pushChoice('制御ファイルのバイナリバックアップが作成される', false);
	pushChoice('制御ファイルを再作成するスクリプトが作成される', true);
	pushChoice('$ORACLE_HOME/dbsにファイルが作成される', false);
	pushChoice('ユーザートレースファイルとして作成される', true);
	sortChoice();
	
	// 158
	q_list.push(new Question('2つの制御ファイルを構成しているデータベースで、1つの制御ファイルに障害が発生し、データベースがマウントできません。'
	+ '\n制御ファイルの格納にはASMを使用しています。'
	+ '\n適切なリカバリ方法を選択しなさい。',
	'SILVER参考書119Pを参照'));
	pushChoice('RMANを使用して、正常な制御ファイルからリストアする', true);
	pushChoice('OSコマンドを使用して、正常な制御ファイルのコピーで損失した制御ファイルを置き換える', false);
	pushChoice('正常な制御ファイルから制御ファイルの再作成スクリプトを生成し、スクリプトを実行して制御ファイルを再作成する', false);
	pushChoice('データベース全体のバックアップをリストアする必要がある', false);
	sortChoice();
	
	// 159
	q_list.push(new Question('オンラインログファイルにおける破損で、不完全リカバリが必要な状況を2つ選択しなさい。',
	'GOLD参考書69Pを参照'));
	pushChoice('カレントなロググループの全メンバーが破損し、ログのクリアに失敗した場合', true);
	pushChoice('カレントなロググループの全メンバーが破損し、ログのクリアに成功した場合', false);
	pushChoice('アクティブなロググループの全メンバーが破損し、チェックポイントの実行に失敗した場合', true);
	pushChoice('アクティブなロググループの全メンバーが破損し、チェックポイントの実行に成功した場合', false);
	pushChoice('非アクティブなロググループの全メンバーが破損した場合', false);
	sortChoice();
	
	// 160
	q_list.push(new Question('PDBに関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書111Pを参照'));
	pushChoice('特定のアプリケーション固有のデータを格納する', true);
	pushChoice('複数のハードウェアリソースを統合して利用する', false);
	pushChoice('異なるCDBへデータの移動を可能にする', true);
	pushChoice('個々のPDB内における権限管理を分離する', true);
	sortChoice();
	
	// 161
	q_list.push(new Question('複数の非CDBと比較したマルチテナントアーキテクチャの利点として適切なものを3つ選択しなさい。',
	'GOLD参考書112Pを参照'));
	pushChoice('使用するメモリー割り当ての詳細なチューニングが可能', false);
	pushChoice('職務の分離によるセキュリティの改善', true);
	pushChoice('メディア障害の削減', false);
	pushChoice('記憶域割り当ての削減', true);
	pushChoice('アップグレードの時間短縮', true);
	sortChoice();
	
	// 162
	q_list.push(new Question('マルチテナントで作成したコンテナデータベースに含まれるコンテナとして正しい説明を3つ選択しなさい。',
	'GOLD参考書112Pを参照'));
	pushChoice('各PDBにインスタンスが対応付けられる', false);
	pushChoice('CDBにインスタンスが対応付けられる', true);
	pushChoice('1つ以上のシードPDBで管理される', false);
	pushChoice('1つ以上のルートコンテナで管理される', true);
	pushChoice('0以上のユーザーPDBを作成できる', true);
	pushChoice('CDBを作成した時点で最低1つのユーザーPDBが必要である', false);
	sortChoice();
	
	// 163
	q_list.push(new Question('CDBレベルでのみ構成できるものを3つ選択しなさい。',
	'GOLD参考書113Pを参照'));
	pushChoice('SPFILEの作成', true);
	pushChoice('暗号化のためのマスター鍵の作成', false);
	pushChoice('Oracle Data Guardによるスタンバイデータベースの作成', true);
	pushChoice('キャラクタセットの設定', true);
	pushChoice('Oracle Database Vaultによる権限設定', false);
	pushChoice('統合監査の設定', false);
	sortChoice();
	
	// 164
	q_list.push(new Question('ルートコンテナのみで管理されるものを3つ選択しなさい。',
	'GOLD参考書113Pを参照'));
	pushChoice('SYSTEM表領域', false);
	pushChoice('制御ファイル', true);
	pushChoice('REDOログファイル', true);
	pushChoice('SYSAUX表領域', false);
	pushChoice('UNDO表領域', true);
	pushChoice('一時表領域', false);
	sortChoice();
	
	// 165
	q_list.push(new Question('PDBごとに実行できる操作として正しいものを3つ選択しなさい。',
	'GOLD参考書114Pを参照'));
	pushChoice('バックアップ／リカバリ', true);
	pushChoice('アプリケーション用表領域の共有', false);
	pushChoice('リソースマネージャの構成', true);
	pushChoice('複数のCDBに同時に接続', false);
	pushChoice('別のサーバへの移動', true);
	sortChoice();
	
	// 166
	q_list.push(new Question('マルチテナント環境に関する正しい説明を選択しなさい。',
	'GOLD参考書115Pを参照'));
	pushChoice('各PDBの管理はローカルユーザーでのみ管理ができる', false);
	pushChoice('SYSTEM表領域はCDBのみに存在する', false);
	pushChoice('パッチの適用はCDBレベルのみに行いPDBごとには行わなくてよい', true);
	pushChoice('同じCDB内のPDB間では、データベースリンクを使用せずにアクセスできる', false);
	sortChoice();
	
	// 167
	q_list.push(new Question('CDBの作成方法として正しいものを2つ選択しなさい。',
	'GOLD参考書116Pを参照'));
	pushChoice('DBCAを使用して新規データベースをコンテナデータベースとして作成する', true);
	pushChoice('既存の非CDBをCDBに変換する', false);
	pushChoice('Oracle Enterprise Manager Database Expressを使用する', false);
	pushChoice('Oracle Enterprise Manager Cloud Controlを使用する', false);
	pushChoice('ENABLE PLUGGABLE DATABASE句を指定したCREATE DATABASE文を使用する', true);
	sortChoice();
	
	// 168
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> CREATE DATABASE cdb2'
	+ '\n  2  ENABLE PLUGGABLE DATABASE;'
	+ '\nCREATE DATABASE cdb2'
	+ '\n*'
	+ '\nERROR at line 1:'
	+ '\nORA-65093: container database not set up properly'
	+ '\n'
	+ '\nエラーが表示された原因として正しいものを選択しなさい。',
	'GOLD参考書118Pを参照'));
	pushChoice('CREATE DATABASE文にSEED句が指定されていない', false);
	pushChoice('pdb_file_name_convertパラメータが設定されていない', false);
	pushChoice('enable_pluggable_databaseパラメータがTRUEに設定されていない', true);
	pushChoice('UNDO表領域名が指定されていない', false);
	sortChoice();
	
	// 169
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> show parameter pdb'
	+ '\n'
	+ '\nNAME                  TYPE        VALUE'
	+ '\n--------------------- ----------- ---------------------'
	+ '\npdb_file_name_convert string      /disk1/, /disk2/'
	+ '\n'
	+ '\nSQL> show parameter db_create_file_dest'
	+ '\n'
	+ '\nNAME                  TYPE        VALUE'
	+ '\n--------------------- ----------- ---------------------'
	+ '\ndb_file_name_dest    string      /disk1'
	+ '\n'
	+ '\nSQL> CREATE DATABASE cdb2 ENABLE PLUGGABLE DATABASE'
	+ '\n  2  SEED FILE_NAME_CONVERT=("/disk1/", "/disk3/");'
	+ '\n'
	+ '\n上記のSQL文実行後の状態として正しいものを2つ選択しなさい。'
	+ '\n',
	'GOLD参考書119Pを参照'));
	pushChoice('ルートコンテナは/disk1に配置される', true);
	pushChoice('ルートコンテナは/disk2に配置される', false);
	pushChoice('ルートコンテナは/disk3に配置される', false);
	pushChoice('シードPDBは/disk1に配置される', true);
	pushChoice('シードPDBは/disk2に配置される', false);
	pushChoice('シードPDBは/disk3に配置される', false);
	pushChoice('シードPDBは存在しない', false);
	sortChoice();
	
	// 170
	q_list.push(new Question('以下のDUPLICATEコマンドによるデータベースの複製について、正しい説明をすべて選んでください。'
	+ '\n'
	+ '\nRMAN> DUPLICATE TARGET DATABASE TO cdb PLUGGABLE DATABASE pdb1, pdb2;',
	'GOLD参考書120Pを参照'));
	pushChoice('複製先ホストに新規CDBが作成され、そのCDB内にPDB1、PDB2が複製して作成される', false);
	pushChoice('アクティブデータベース複製が実行される', false);
	pushChoice('補助インスタンスの初期化パラメータとして、ENABLE_PLUGGABLE_DATABASE=trueが設定されている必要がある', true);
	pushChoice('シードPDB(PDB$SEED)が複製される', true);
	pushChoice('SPFILEが複製される', false);
	sortChoice();
	
	// 171
	q_list.push(new Question('現在、cdb1データベースには、pdb1、pdb2、pdb3のプラガブルデータベースが存在します。'
	+ '\n次のコマンドを使用した場合の結果として正しいものを選択しなさい。'
	+ '\n'
	+ '\nDUPLICATE DATABASE TO cdb3'
	+ '\n PLUGGABLE DATABASE pdb1'
	+ '\n TABLESPACE pdb2:users;',
	'GOLD参考書121Pを参照'));
	pushChoice('FROM ACTIVE DATABASE句を指定しないためエラーとなる', false);
	pushChoice('一部の表領域のみの指定はできないためエラーとなる', false);
	pushChoice('PDB1とUSERS表領域を持つPDB2で構成されたCDB3が作成される', true);
	pushChoice('USERS表領域のみを持つPDB1とPDB2で構成されたCDB3が作成される', false);
	sortChoice();
	
	// 172
	q_list.push(new Question('マルチテナントのデータディクショナリビューに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書121Pを参照'));
	pushChoice('CDB_xxxビューにはすべてのコンテナからの結果が表示される', true);
	pushChoice('CDB_xxxビューはルートでのみアクセスできる', false);
	pushChoice('DBA_xxxビューにはCON_ID列が追加されている', false);
	pushChoice('DBA_xxxビューには現コンテナに関する情報のみ表示される', true);
	sortChoice();
	
	// 173
	q_list.push(new Question('マルチテナントの名前やIDに関する規則として正しいものを2つ選択しなさい。',
	'GOLD参考書122Pを参照'));
	pushChoice('1つのCDB内でPDBには一意な名前が必要', true);
	pushChoice('シードPDBのCON_IDは2である', true);
	pushChoice('PDB名は大文字／小文字が区別される', false);
	pushChoice('CDB名と同じPDB名を作成することができる', false);
	pushChoice('PDB名を後から変更することはできない', false);
	sortChoice();
	
	// 174
	q_list.push(new Question('非CDB環境をマルチテナント環境に移行し、かつ、スキーマ構造を大幅に変更することになりました。'
	+ '\n元の環境を残しながらテストを行う方法として適切なものを選択しなさい。',
	'GOLD参考書123Pを参照'));
	pushChoice('元の環境をPDBとして接続し、テスト後にPDBでフラッシュバックデータベース機能を使用する', false);
	pushChoice('元の環境をPDBとして接続するときにファイルを新しい場所に配置する', true);
	pushChoice('元の環境をCDBに変換し、対象となる表領域をクローニングする', false);
	pushChoice('元の環境をPDBとして接続し、テスト後に切断すれば元に戻される', false);
	sortChoice();
	
	// 175
	q_list.push(new Question('以下のコマンドを実行したときの動作について、正しいものをすべて選んでください。'
	+ '\n'
	+ '\nSQL> CREATE PLUGGABLE DATABASE pdb9'
	+ '\n  ADMIN USER pdb9admin IDENTIFIED BY Password123'
	+ '\n  FILE_NAME_CONVERT=("/pdbseed/", "/pdb9/");',
	'GOLD参考書123Pを参照'));
	pushChoice('プラガブルデータベースPDB9が作成され、READ WRITEモードとなる', false);
	pushChoice('プラガブルデータベースPDB9が作成され、MOUNTモードとなる', true);
	pushChoice('デフォルト表領域が指定されていないため、プラガブルデータベースPDB9は作成されない', false);
	pushChoice('pdb9adminユーザーにはPDB_DBAロールが付与される', true);
	pushChoice('pdb9adminユーザーにはDBAロールが付与される', false);
	pushChoice('pdb9adminユーザーにはSYSDBA権限が付与される', false);
	pushChoice('pdb9adminユーザーにはCREATE SESSION権限のみが付与される', false);
	sortChoice();
	
	// 176
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\nシードPDBのデータファイルは/disk1以下にあるものとします。'
	+ '\n'
	+ '\nSQL> show parameter pdb'
	+ '\n'
	+ '\nNAME                  TYPE       VALUE'
	+ '\n--------------------- ---------- ----------------------'
	+ '\npdb_file_name_convert string     /disk1/, /disk2/'
	+ '\n'
	+ '\nSQL> CREATE PLUGGABLE DATABASE pdb2'
	+ '\n  2  ADMIN USER pdb2adm IDENTIFIED BY password;'
	+ '\n'
	+ '\n実行結果に関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書124Pを参照'));
	pushChoice('シードPDBをもとにpdb2が作成される', true);
	pushChoice('現在接続しているPDBからpdb2がクローニングされる', false);
	pushChoice('pdb2のファイルは元PDBと同じ場所に配置される', false);
	pushChoice('pdb2のファイルは/disk2に配置される', true);
	pushChoice('pdb2admユーザーが作成されPDB_DBAロールが付与される', true);
	sortChoice();
	
	// 177
	q_list.push(new Question('PDBのクローニングに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書125Pを参照'));
	pushChoice('同じCDB内でのみクローニングすることができる', false);
	pushChoice('STORAGE句でPDBが使用できる記憶域の量を制限することができる', true);
	pushChoice('ファイルの配置はOMFが必要である', false);
	pushChoice('ソースPDBをREAD ONLYでオープンする必要がある', true);
	pushChoice('ソースPDBの一部の表領域だけをクローニングすることもできる', false);
	sortChoice();
	
	// 178
	q_list.push(new Question('以下のコマンドを実行したときの動作について、正しいものをすべて選んでください。'
	+ '\nPDB1のデータファイルは/u01/oradata/pdb1/以下にあるものとします。'
	+ '\n'
	+ '\nSQL> CREATE PLUGGABLE DATABASE pdb2 FROM pdb1'
	+ '\n       FILE_NAME_CONVERT = ("/u01/oradata/pdb1/", "/u02/oradata/pdb2/");',
	'GOLD参考書126Pを参照'));
	pushChoice('プラガブルデータベースPDB1をもとにプラガブルデータベースPDB2が作成され、READ ONLYモードとなる', false);
	pushChoice('プラガブルデータベースPDB1をもとにプラガブルデータベースPDB2が作成され、MOUNTモードとなる', true);
	pushChoice('デフォルト表領域が指定されていないため、プラガブルデータベースPDB1は作成されない', false);
	pushChoice('PDB1に存在するローカルユーザーはPDB2にコピーされる', true);
	pushChoice('PDB1に存在する共通ユーザーはPDB2にコピーされる', true);
	pushChoice('PDB1に存在するローカルユーザーはPDB2にコピーされない', false);
	sortChoice();
	
	// 179
	q_list.push(new Question('3つのPDBが接続されている12.1のCDBを12.2にアップグレードすることになりました。'
	+ '\nPDBのうちの1つを12.1のままで動作させる方法として適切なものを選択しなさい。',
	'GOLD参考書126Pを参照'));
	pushChoice('CDBを12.2にアップグレードしてもシードPDBは12.1のままのため、アップグレード後にシードPDBからPDBを新規作成する', false);
	pushChoice('CDBのアップグレード後、12.1のままにするPDBをダウングレードする', false);
	pushChoice('CDBのアップグレード前に12.1のままにするPDBを切断し、別の12.1のCDBに接続する', true);
	pushChoice('CDBのアップグレードはオープンしているPDBにのみ影響するため、12.1のままにするPDBをクローズしておく', false);
	sortChoice();
	
	// 180
	q_list.push(new Question('PDBの切断（アンプラグ）に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書127Pを参照'));
	pushChoice('切断するPDBはMOUNTモードまたはREAD ONLYモードでオープンしている必要がある', false);
	pushChoice('切断するPDBはMOUNTモードである必要がある', true);
	pushChoice('切断するPDBはREAD ONLYモードでオープンしている必要がある', false);
	pushChoice('UNPLUG INTO句に指定したXMLファイルとしてメタデータが出力される', true);
	pushChoice('DATAPUMP_DIRディレクトリオブジェクトに対応するディレクトリに、メタデータのダンプファイルがエクスポートされる', false);
	pushChoice('切断されたPDBのデータファイルは自動的に削除される', false);
	sortChoice();
	
	// 181
	q_list.push(new Question('PDBの削除に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書128Pを参照'));
	pushChoice('アンプラグまたはクローズしている必要がある', true);
	pushChoice('削除するPDBはREAD ONLYでオープンしている必要がある', false);
	pushChoice('シードPDBは削除できない', true);
	pushChoice('INCLUDING DATAFILE句を指定することで、CDBの制御ファイルからの参照が削除される', false);
	pushChoice('INCLUDING DATAFILE句を指定することで、物理的なファイルを保存することができる', false);
	sortChoice();
	
	// 182
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> connect sys@salesdb'
	+ '\nSQL> SELECT parameter, value FROM v$nls_parameters'
	+ '\n  2  WHERE parameter LIKE "%CHARACTERSET";'
	+ '\n'
	+ '\nPARAMETER              VALUE   '
	+ '\n---------------------- -------------------'
	+ '\nNLS_CHARACTERSET       WE8ISO8859P1'
	+ '\nNLS_NCHAR_CHARACTERSET AL16UTF16'
	+ '\n'
	+ '\nSQL> connect sys@syscdb1'
	+ '\nSQL> SELECT parameter, value FROM v$nls_parameters'
	+ '\n  2  WHERE parameter LIKE "%CHARACTERSET";'
	+ '\n'
	+ '\nPARAMETER              VALUE   '
	+ '\n---------------------- -------------------'
	+ '\nNLS_CHARACTERSET       WE8MSWIN1252'
	+ '\nNLS_NCHAR_CHARACTERSET AL16UTF16'
	+ '\n'
	+ '\nsalesdbは非CDBです。'
	+ '\n同じデータベースバージョンのcdb1に接続（プラグ）するための手順として正しいものを選択しなさい。',
	'GOLD参考書128Pを参照'));
	pushChoice('スーパーセットのキャラクタセットのためそのまま接続できる', true);
	pushChoice('Unicodeに移行してからであれば接続できる', false);
	pushChoice('異なるキャラクタセットを使用しているため接続できない', false);
	pushChoice('RMANでCONVERT後であれば接続できる', false);
	sortChoice();
	
	// 183
	q_list.push(new Question('マルチテナント環境の接続に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書130Pを参照'));
	pushChoice('パスワードファイル認証を使用すればPDBへのローカル接続が可能', false);
	pushChoice('1つのリスナーのみを使用する場合、PDBへのサービス名はすべてのCDBにわたって一意な名前が必要', true);
	pushChoice('CDBへの接続はリモート接続が必要', false);
	pushChoice('別のPDBのオブジェクトへのアクセスはデータベースリンクを使用', true);
	sortChoice();
	
	// 184
	q_list.push(new Question('SQL*PLUSなどのOracleクライアントからPDBへ接続する方法で、正しいものをすべて選んでください。',
	'GOLD参考書131Pを参照'));
	pushChoice('PDBに対するネットサービス名を指定して接続する', true);
	pushChoice('簡易接続を使用して接続する', true);
	pushChoice('共通ユーザーでPDBに直接ローカル接続する', false);
	pushChoice('共通ユーザーでPDBに接続を切り替える', true);
	pushChoice('ローカルユーザーでPDBに直接ローカル接続する', false);
	pushChoice('ローカルユーザーでPDBに接続を切り替える', false);
	sortChoice();
	
	// 185
	q_list.push(new Question('ALTER SESSION SET CONTAINER文に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書131Pを参照'));
	pushChoice('ローカルユーザーのみ使用できる', false);
	pushChoice('共有ユーザーのみ使用できる', true);
	pushChoice('ローカルユーザー、共通ユーザーいずれも使用できる', false);
	pushChoice('AFTER LOGONトリガーが実行される', false);
	pushChoice('切り替え前トランザクションは継続する', true);
	sortChoice();
	
	// 186
	q_list.push(new Question('PDB1とPDB2が存在するCDB1があります。'
	+ '\nPDB1とPDB2の間で分散トランザクションを使用したいという要望が上がっています。'
	+ '\n必要な構成を選択しなさい。',
	'GOLD参考書132Pを参照'));
	pushChoice('デフォルトでPDB間の通信が有効なため、「オブジェクト名@PDB名」構文で、対象PDB上のオブジェクトにアクセスできる', false);
	pushChoice('デフォルトでPDB間の通信が有効であるが、サービス名でアクセスが必要なため「オブジェクト名@サービス名」構文で、対象PDBにアクセスできるサービス名を使用する', false);
	pushChoice('デフォルトでPDB間の通信が無効なため、明示的にデータベースリンクを使用し、「オブジェクト名@データベースリンク名」構文でアクセスする', true);
	sortChoice();
	
	// 187
	q_list.push(new Question('マルチテナントにおいて、リスナーに動的登録されるサービス名を2つ選択しなさい。',
	'GOLD参考書132Pを参照'));
	pushChoice('シードPDB名', false);
	pushChoice('ルートコンテナ名', false);
	pushChoice('データベース名', true);
	pushChoice('PDB名', true);
	sortChoice();
	
	// 188
	q_list.push(new Question('PDBに独自のサービス名を設定する方法として正しいものを選択しなさい。',
	'GOLD参考書133Pを参照'));
	pushChoice('PDB独自のサービス名を追加することはできない', false);
	pushChoice('シングル環境ではPDB独自のサービス名を追加することはできない', false);
	pushChoice('DBMS_SERVICEパッケージか、SRVCTL、EM Cloud Controlを使用することでPDB独自のサービス名が追加される', true);
	pushChoice('service_namesパラメータを変更することでPDB独自のサービス名が追加される', false);
	sortChoice();
	
	// 189
	q_list.push(new Question('CDBを起動したときの動作を正しい順序に並べたものを選択しなさい。'
	+ '\n'
	+ '\n1.シードPDBがREAD ONLYでオープン'
	+ '\n2.インスタンスの起動'
	+ '\n3.REDOログファイルとルートコンテナのデータファイルをオープン'
	+ '\n4.制御ファイルをマウント'
	+ '\n5.PDBをオープンするトリガーがあればシードPDB以外のPDBをオープン',
	'GOLD参考書133Pを参照'));
	pushChoice('2 → 4 → 1 → 3 → 5', false);
	pushChoice('2 → 4 → 3 → 1 → 5', true);
	pushChoice('2 → 4 → 3 → 5 → 1', false);
	pushChoice('2 → 4 → 1 → 5 → 3', false);
	sortChoice();
	
	// 190
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nCREATE OR REPLACE TRIGGER Open_All_PDBs'
	+ '\nAFTER STARTUP ON DATABASE'
	+ '\nBEGIN'
	+ '\n  EXECUTE IMMEDIATE'
	+ '\n  "ALTER PLUGGABLE DATABASE ALL OPEN";'
	+ '\nEND;'
	+ '\n/'
	+ '\n'
	+ '\n上記のトリガーによる処理が成功するタイミングとして正しいものを2つ選択しなさい。',
	'GOLD参考書134Pを参照'));
	pushChoice('CDBをREAD WRITEでオープンするとき', true);
	pushChoice('CDBをREAD ONLYでオープンするとき', false);
	pushChoice('CDBをRESETLOGSでオープンするとき', true);
	pushChoice('CDBをRESTRICTEDモードでオープンするとき', false);
	pushChoice('CDBに特権ユーザーがセッションを確立するとき', false);
	sortChoice();
	
	// 191
	q_list.push(new Question('PDBの起動と停止のオプションに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書135Pを参照'));
	pushChoice('RESTRICTEDモードでオープンするとRESTRICTED SESSION権限を持つユーザーのみが接続できる', true);
	pushChoice('READ ONLYモードでオープンしてもルートコンテナからは変更することができる', false);
	pushChoice('オープン済みのPDBが存在してもALL OPENで残りをオープンすることができる', true);
	pushChoice('ALTER PLUGGABLE DATABASE文によるOPENとCLOSEはCDBからのみ実行できる', false);
	pushChoice('クローズ済みのPDBが存在する場合はALL EXCEPTでCLOSEする必要がある', false);
	sortChoice();
	
	// 192
	q_list.push(new Question('PDBの起動と停止に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書136Pを参照'));
	pushChoice('CDBがオープンされると全PDBがマウントされる', false);
	pushChoice('シードPDBをREAD WRITEでオープンすることはできないがCLOSEすることはできる', false);
	pushChoice('すべてのPDBを一括でオープンすることができる', true);
	pushChoice('PDBに接続した状態で他PDBをクローズすることはできない', true);
	pushChoice('すべてのPDBをクローズするとCDBがクローズされる', false);
	sortChoice();
	
	// 193
	q_list.push(new Question('PDBの停止に関する説明として正しいものを選択しなさい。',
	'GOLD参考書137Pを参照'));
	pushChoice('PDBに接続してSHUTDOWNコマンドを実行するとインスタンスが停止される', false);
	pushChoice('PDBのクローズは1つずつ行うか一括で行うことしかできない', false);
	pushChoice('PDBをクローズせずにCDBを停止すると次回インスタンス起動時にリカバリが必要になる', false);
	pushChoice('IMMEDIATE句を指定するとトランザクションがロールバックされ、セッションが切断される', true);
	pushChoice('FORCEオプションを指定してPDBをOPENするとインスタンスリカバリが実行される', false);
	sortChoice();
	
	// 194
	q_list.push(new Question('マルチテナントの初期化パラメータに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書138Pを参照'));
	pushChoice('CDBごとに初期化パラメータファイルを持つ', true);
	pushChoice('PDBごとに初期化パラメータファイルを持つ', false);
	pushChoice('PDBごとの初期化パラメータファイルはディクショナリに保存される', true);
	pushChoice('PDBごとの初期化パラメータファイルは初期化パラメータファイルに保存される', false);
	sortChoice();
	
	// 195
	q_list.push(new Question('PDBの初期化パラメータを変更する方法として正しいものを選択しなさい。',
	'GOLD参考書138Pを参照'));
	pushChoice('ルートコンテナからSCOPE=PDB名で変更する', false);
	pushChoice('PDBに接続して変更する。保存が不要ならSCOPE=MEMORYを使用する', true);
	pushChoice('PDBに接続してSCORE=PDB名で変更する', false);
	pushChoice('PDBに接続して変更する。SCOPEを指定することはできない', false);
	pushChoice('PDBに接続して変更する。SCOPEを指定しても常にBOTHになる', false);
	sortChoice();
	
	//196
	q_list.push(new Question('SPFILEを使用するデータベースにおいて、SYSユーザーでCDB$ROOTに接続しています。'
	+ '\n以下のコマンドを実行したときのWORK_AREA_SIZE_POLICY初期化パラメータの変更について正しいものをすべて選んでください。'
	+ '\nなお、WORK_AREA_SIZE_POLICY初期化パラメータはPDBレベルで変更可能なパラメータです。'
	+ '\n'
	+ '\nSQL> ALTER SYSTEM SET WORK_AREA_SIZE_POLICY=MANUAL SCOPE=BOTH;',
	'GOLD参考書139Pを参照'));
	pushChoice('SPFILEとCDBインスタンスがMANUALに設定されます', true);
	pushChoice('CDB$ROOTだけがMANUALに設定されます', false);
	pushChoice('すべてのPDBに対して、MANUALに設定されます', false);
	pushChoice('WORK_AREA_SIZE_POLICYパラメータが設定されているすべてのPDBに対して、MANUALが設定されます', false);
	pushChoice('WORK_AREA_SIZE_POLICYパラメータが設定されていないすべてのPDBに対して、MANUALが設定されます', true);
	sortChoice();
	
	// 197
	q_list.push(new Question('SPFILEを使用するデータベースにおいて、SYSユーザーでプラガブルデータベースPDB1に接続しています。'
	+ '\n以下のコマンドを実行したときのWORK_AREA_SIZE_POLICY初期化パラメータの変更について正しいものを選んでください。'
	+ '\nなお、WORK_AREA_SIZE_POLICY初期化パラメータPDBレベルで変更可能なパラメータです。'
	+ '\n'
	+ '\nSQL> ALTER SYSTEM SET WORK_AREA_SIZE_POLICY=MANUAL SCOPE=SPFILE;',
	'GOLD参考書139Pを参照'));
	pushChoice('CDBインスタンスを再起動したタイミングで、PDB1に対してMANUALが設定されます', false);
	pushChoice('CDBインスタンスを再起動したタイミングで、ルートコンテナに対してMANUALが設定されます', false);
	pushChoice('PDB1を再オープンしたタイミングで、PDB1に対してMANUALが設定されます', true);
	pushChoice('ALTER SYSTEM SET分の実行直後に、PDB1に対してMANUALが設定されます', false);
	pushChoice('ALTER SYSTEM SET分の実行直後に、ルートコンテナに対してMANUALが設定されます', false);
	pushChoice('ALTER SYSTEM SET文がエラーで失敗します', false);
	sortChoice();
	
	// 198
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nALTER SYSTEM SET open_cursors=200 CONTAINER=ALL SCOPE=BOTH;'
	+ '\n'
	+ '\n実行に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書140Pを参照'));
	pushChoice('CDBを再起動するとリセットされる', false);
	pushChoice('現在オープンしているPDBにのみ反映される', false);
	pushChoice('SPFILEに保存される', true);
	pushChoice('ルートコンテナでのみ実行できる', true);
	pushChoice('ルートコンテナ以外のPDBに片影される', false);
	sortChoice();
	
	// 199
	q_list.push(new Question('noncdb_compatible初期化パラメータがFALSEのCDBがあります。'
	+ '\nPDBに接続して実行すると、エラーとなるSQL文を選択しなさい。',
	'GOLD参考書141Pを参照'));
	pushChoice('ALTER SYSTEM CHECKPOINT;', false);
	pushChoice('ALTER SYSTEM SWITCH LOGFILE;', true);
	pushChoice('ALTER SYSTEM FLUSH SHARED_POOL;', false);
	pushChoice('ALTER SYSTEM FLUSH BUFFER_CACHE;', false);
	pushChoice('いずれの文もエラーにならない', false);
	sortChoice();
	
	// 200
	q_list.push(new Question('マルチテナント環境の自動診断リポジトリに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書142Pを参照'));
	pushChoice('PDBごとにアラートログファイルが存在する', false);
	pushChoice('CDBごとにアラートログファイルが存在する', true);
	pushChoice('アラートログにPDB情報は記録されない', false);
	pushChoice('アラートログにPDB情報は記録される', true);
	sortChoice();
	
	// 201
	q_list.push(new Question('ALTER PLUGGABLE DATABASE文を使用して、PDBごとに変更できる句を4つ選択しなさい。',
	'GOLD参考書142Pを参照'));
	pushChoice('ENABLE BLOCK CHANGE TRACKING', false);
	pushChoice('DEFAULT TABLESPACE', true);
	pushChoice('DEFAULT TEMPORARY TABLESPACE', true);
	pushChoice('STORAGE', true);
	pushChoice('DATAFILE', true);
	sortChoice();
	
	// 202
	q_list.push(new Question('マルチテナントの表領域に関する説明として正しいものを選択しなさい。',
	'GOLD参考書144Pを参照'));
	pushChoice('1つの表領域は1つのコンテナのみに対応付けられる', true);
	pushChoice('表領域はルートコンテナでのみ作成される', false);
	pushChoice('CREATE DATABASE文でシードPDBに表領域を追加することはできない', false);
	pushChoice('各PDBでデータファイルを共有することができる', false);
	pushChoice('UNDO表領域をPDBで作成することができる', false);
	sortChoice();
	
	// 203
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> CREATE TABLESPACE tbs01 DATAFILE "/disk1/tbs01.dbf" SIZE 10M;'
	+ '\nSQL> ALTER DATABASE DEFAULT TABLESPACE tbs01;'
	+ '\n'
	+ '\n上記のコマンドをルートコンテナで実行したときの結果として正しいものを2つ選択しなさい。',
	'GOLD参考書145Pを参照'));
	pushChoice('既存ユーザーのデフォルト表領域が変更される', true);
	pushChoice('既存ユーザーのデフォルト表領域は変更されない', false);
	pushChoice('ルートコンテナのデフォルト永続表領域が変更される', true);
	pushChoice('ルートコンテナと全PDBのデフォルト永続表領域が変更される', false);
	pushChoice('ルートコンテナとシードPDBを除く全PDBのデフォルト永続表領域が変更される', false);
	sortChoice();
	
	// 204
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> ALTER SESSION SET CONTAINER=pdb1;'
	+ '\n'
	+ '\nSQL> ALTER PLUGGABLE DATABASE'
	+ '\n  2  STORAGE(MAX_SHARED_TEMP_SIZE 300M);'
	+ '\n'
	+ '\n上記のコマンドを実行した結果として正しいものを選択しなさい。',
	'GOLD参考書145Pを参照'));
	pushChoice('PDB1では最大300MBまでの一時表領域を作成できる', false);
	pushChoice('最大300MBまでPDB1が共有一時表領域を使用できる', true);
	pushChoice('最大300MBまでPDB1で表領域を作成できる', false);
	pushChoice('このセッションでは最大300MBまでの一時表領域を使用できる', false);
	sortChoice();
	
	// 205
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> CREATE USER scott IDENTIFIED BY tiger;'
	+ '\n'
	+ '\n上記コマンドをPDBで実行したときの結果として正しいものを2つ選択しなさい。',
	'GOLD参考書146Pを参照'));
	pushChoice('PDBのデフォルト一時表領域が設定されていない場合、CDBのSYSTEM表領域が使用される', false);
	pushChoice('PDBのデフォルト一時表領域が設定されていない場合、PDBのSYSTEM表領域が使用される', false);
	pushChoice('PDBのデフォルト一時表領域が設定されていない場合、CDBのデフォルト一時表領域が使用される', true);
	pushChoice('PDBのデフォルト一時表領域が設定されている場合、PDBのデフォルト一時表領域が使用される', true);
	pushChoice('PDBのデフォルト一時表領域が設定されている場合でも、CDBのデフォルト一時表領域が使用される', false);
	sortChoice();
	
	// 206
	q_list.push(new Question('マルチテナント環境のユーザーに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書148Pを参照'));
	pushChoice('共通ユーザーはルートコンテナでのみ作成できる', true);
	pushChoice('ローカルユーザーはすべてのコンテナで作成できる', false);
	pushChoice('「CONTAINER=CURRENT」を指定しても共通ユーザーは全コンテナに作成される', false);
	pushChoice('共通ユーザー名はC##で始める必要がある', true);
	pushChoice('「CONTAINER=ALL」を指定すると各コンテナにローカルユーザーが作成される', false);
	sortChoice();
	
	// 207
	q_list.push(new Question('マルチテナント環境の共通ユーザー管理に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書149Pを参照'));
	pushChoice('各PDBで削除することができる', false);
	pushChoice('READ ONLYのPDBでは、次回READ WRITEになったときに追加される', true);
	pushChoice('デフォルト表領域、一時表領域を指定する場合は、すべてのPDBに対象表領域が存在している必要がある', true);
	pushChoice('権限がなくてもすべてのPDBに接続できる', false);
	sortChoice();
	
	// 208
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> connect / as sysdba'
	+ '\n'
	+ '\nSQL> CREATE ROLE dbaRole CONTAINER=ALL;'
	+ '\n'
	+ '\n上記のSQL実行に関する説明として正しいものを選択しなさい。',
	'GOLD参考書150Pを参照'));
	pushChoice('すべてのPDBにロールが作成される', false);
	pushChoice('ルートコンテナでロールは作成できないため、実行エラーとなる', false);
	pushChoice('ルートコンテナでローカルロールは作成できないため、実行エラーとなる', true);
	pushChoice('すべてのPDBにローカルロールが作成される', false);
	sortChoice();
	
	// 209
	q_list.push(new Question('マルチテナントのロール管理に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書150Pを参照'));
	pushChoice('ローカルロールは、共通ユーザーまたはローカルユーザーに付与できる', true);
	pushChoice('共通ロールは共通ユーザーにのみ付与できる', false);
	pushChoice('共通ロールは別の共通ロールに付与できるが、ローカルロールには付与できない', false);
	pushChoice('ルートコンテナにローカルロールを作成できる', false);
	pushChoice('ルートコンテナでのみ共通ロールを作成できる', true);
	sortChoice();
	
	// 210
	q_list.push(new Question('管理者権限を持つユーザーが、PDBに接続して以下のコマンドを実行したときの動作について、正しい説明を選んでください。'
	+ '\n'
	+ '\nGRANT c##role1 TO c##role2;  ---(1)'
	+ '\nGRANT c##role1 TO role3;     ---(2)'
	+ '\nGRANT role3 TO c##role3;     ---(3)',
	'GOLD参考書151Pを参照'));
	pushChoice('PDBでは共通ロールに関する操作ができないため、すべてエラーで失敗する', false);
	pushChoice('PDBでは共通ロールとローカルロールに関連する操作を実行できないため、(2)および(3)がエラーで失敗する', false);
	pushChoice('PDBでは共通ロールに対してロールを付与できないため、(1)および(3)がエラーで失敗する', false);
	pushChoice('すべて成功する', true);
	sortChoice();
	
	// 211
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> GRANT CREATE TABLE TO c##x CONTAINER=CURRENT;'
	+ '\n'
	+ '\n上記のSQL実行に関する説明として正しいものを選択しなさい。',
	'GOLD参考書152Pを参照'));
	pushChoice('ルートコンテナでのみ実行可能', false);
	pushChoice('PDBでのみ実行可能', false);
	pushChoice('ルートコンテナで実行した場合はすべてのコンテナに反映される', false);
	pushChoice('実行したコンテナのみに反映される', true);
	sortChoice();
	
	// 212
	q_list.push(new Question('管理者権限を持つユーザーが、CDB$ROOTで以下のコマンドを実行したときの動作について、正しい説明をすべて選んでください。'
	+ '\n'
	+ '\nCREATE ROLE c##a_role CONTAINER=ALL;'
	+ '\nGRANT SELECT ON DBA_USERS TO c##a_role CONTAINER=ALL;'
	+ '\nGRANT SET CONTAINER TO c##a_role;',
	'GOLD参考書152Pを参照'));
	pushChoice('ロールc##a_roleにDBA_USERSへのSELECTオブジェクト権限が共通に付与される', true);
	pushChoice('ロールc##a_roleにDBA_USERSへのSELECTオブジェクト権限がローカルに付与される', false);
	pushChoice('エラーにより、ロールc##a_roleへのDBA_USERSへのSELECTオブジェクト権限の付与が失敗する', false);
	pushChoice('ロールc##a_roleにSET CONTAINERシステム権限が共通に付与される', false);
	pushChoice('ロールc##a_roleにSET CONTAINERシステム権限がローカルに付与される', true);
	pushChoice('エラーにより、ロールc##a_roleへのSET CONTAINERシステム権限の付与が失敗する', false);
	sortChoice();
	
	// 213
	q_list.push(new Question('管理者権限を持つユーザーが、CDB$ROOTにおける以下のコマンド実行結果を踏まえた、REVOKE文の実行結果で正しいものを選んでください。'
	+ '\n'
	+ '\nSQL> SELECT con_id, grantee, granted_role, admin_option, common FROM CDB_ROLE_PRIVS'
	+ '\n  2    WHERE grantee="C##ADMIN";'
	+ '\n'
	+ '\n    CON_ID GRANTEE    GRANTED_ROLE           ADM COM'
	+ '\n---------- ---------- ---------------------- --- ---'
	+ '\n         1 C##A_ADMIN C##ROLE1               NO  YES'
	+ '\n         3 C##A_ADMIN C##ROLE1               NO  YES'
	+ '\n         4 C##A_ADMIN C##ROLE1               NO  YES'
	+ '\n'
	+ '\nSQL> REVOKE c##role1 FROM c##a_admin;',
	'GOLD参考書153Pを参照'));
	pushChoice('REVOKE文の実行は成功し、ルートコンテナでのみロール付与が取り消される', false);
	pushChoice('REVOKE文の実行は成功し、すべてのコンテナでロール付与が取り消される', false);
	pushChoice('REVOKE文にCONTAINER=ALLの指定がないため、ロール付与の取り消しが失敗する', true);
	pushChoice('REVOKE文にCONTAINER=CURRENTの指定がないため、ロール付与の取り消しが失敗する', false);
	sortChoice();
	
	// 214
	q_list.push(new Question('管理ユーザーでルートコンテナに接続し、以下の手順で共通ロールC##CONNECTを作成しました。'
	+ '\n'
	+ '\nSQL> CREATE ROLE C##CONNECT;'
	+ '\nSQL> GRANT CREATE TABLE TO C##CONNECT;'
	+ '\n'
	+ '\nその後、管理ユーザーでPDBに接続し、以下の手順でローカルユーザーを作成しました。'
	+ '\n'
	+ '\nSQL> CREATE USER user1 IDENTIFIED BY Password123;'
	+ '\nSQL> GRANT CREATE SESSION to user1;'
	+ '\nSQL> GRANT C##CONNECT to user1;'
	+ '\n'
	+ '\n作成したローカルユーザーuser1でPDBに接続した後、以下のコマンドを実行した結果について、正しいものを選んでください。',
	'GOLD参考書154Pを参照'));
	pushChoice('共通ロールC##CONNECTにCREATE TABLEシステム権限が付与されているため、成功する', false);
	pushChoice('CREATE TABLE文の実行には特に権限が不要なため、成功する', false);
	pushChoice('共通ロールC##CONNECTにCREATE TABLEシステム権限が付与されていないため、失敗する', true);
	pushChoice('ローカルユーザーuser1への共通ロールC##CONNECTの付与は無効とみなされるため、失敗する', false);
	sortChoice();
	
	// 215
	q_list.push(new Question('マルチテナント内のスキーマ名とオブジェクト名に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書155Pを参照'));
	pushChoice('スキーマ名はCDB内で一意にする必要がある', false);
	pushChoice('オブジェクト名の解決は接続先PDBのみで行われる', true);
	pushChoice('PUBLICスキーマは個々のPDBに存在する', true);
	pushChoice('共通スキーマは全PDBで同じオブジェクトを共有する', false);
	sortChoice();
	
	// 216
	q_list.push(new Question('マルチテナントのデータディクショナリに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書156Pを参照'));
	pushChoice('各PDBに必要なデータは、ディクショナリ定義も含め各PDBに格納されている', false);
	pushChoice('メタデータリンクを使用してPDBに格納されたメタデータにアクセスが行われる', false);
	pushChoice('メタデータリンクを使用してルートに格納されたメタデータにアクセスが行われる', true);
	pushChoice('PDBにしか記録されないオブジェクトのデータはオブジェクトリンクを使用してアクセスが行われる', false);
	pushChoice('ルートにしか記録されないオブジェクトのデータはオブジェクトリンクを使用してアクセスが行われる', true);
	sortChoice();
	
	// 217
	q_list.push(new Question('次の資料を確認してください。'
	+ '\n'
	+ '\nセッション1'
	+ '\n---------------------------------------------------------------'
	+ '\nSQL> connect sys@pdb1'
	+ '\nSQL> SELECT con_id, username, FROM v$session WHERE type="USER";'
	+ '\n'
	+ '\nCON_ID USERNANE'
	+ '\n------ --------'
	+ '\n     3 SYS'
	+ '\n---------------------------------------------------------------'
	+ '\n'
	+ '\nセッション2'
	+ '\n---------------------------------------------------------------'
	+ '\nSQL> connect c##u'
	+ '\nSQL> SELECT con_id, username, FROM v$session WHERE type="USER";'
	+ '\n'
	+ '\nCON_ID USERNANE'
	+ '\n------ --------'
	+ '\n     1 DBSNMP'
	+ '\n     1 C##U'
	+ '\n     1 DBSNMP'
	+ '\n---------------------------------------------------------------'
	+ '\n'
	+ '\n上記の結果に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書157Pを参照'));
	pushChoice('セッション1はPDBに接続しているため、ほかのコンテナの結果が表示されない', true);
	pushChoice('V$SESSIONは接続しているPDBの情報のみ表示されるため、ほかのコンテナの結果が表示されない', false);
	pushChoice('セッション2はルートコンテナに接続しているが、PDB1に対するCONTAINER_DATA属性が設定されていないため、PDB1の結果が表示されない', true);
	pushChoice('V$SESSIONで表示されるSYSユーザーのセッションは、接続しているPDBの情報のみ表示されるため、ほかのコンテナの結果が表示されない', false);
	sortChoice();
	
	// 218
	q_list.push(new Question('マルチテナントのバックアップに関する説明として正しいものを選択しなさい。',
	'GOLD参考書159Pを参照'));
	pushChoice('ルートコンテナでのみバックアップを取得することができる', false);
	pushChoice('ルートコンテナのみのバックアップを取得することはできない', false);
	pushChoice('ルートコンテナからPDB内の特定の表領域のみをバックアップすることはできない', false);
	pushChoice('ルートコンテナからPDB内の特定のデータファイルのファイル名を指定してバックアップすることはできない', true);
	pushChoice('ルートコンテナから特定のPDBのみをバックアップすることはできない', false);
	sortChoice();
	
	// 219
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG;'
	+ '\n'
	+ '\n上記のコマンドをルートコンテナに接続して実行したときに取得されるバックアップファイルとして、正しいものを選択しなさい。',
	'GOLD参考書160Pを参照'));
	pushChoice('ルートコンテナの全データファイル、存在するすべてのアーカイブログ、制御ファイルとSPFILE', false);
	pushChoice('ルートコンテナの全データファイル、存在するすべてのアーカイブログ', false);
	pushChoice('CDBの全データファイル、存在するすべてのアーカイブログ、制御ファイルとSPFILE', true);
	pushChoice('CDBの全データファイル、存在するすべてのアーカイブログ', false);
	sortChoice();
	
	// 220
	q_list.push(new Question('RMANでPDBに接続して以下のコマンドを実行したときの結果として、正しいものを1つ選んでください。'
	+ '\nCDBはARCHIVELOGモードであるとします。'
	+ '\n'
	+ '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG DELETE INPUT;',
	'GOLD参考書161Pを参照'));
	pushChoice('エラーで失敗する', false);
	pushChoice('データベースおよびアーカイブログファイルがバックアップされるが、バックアップされたアーカイブログが削除されない', false);
	pushChoice('データベースおよびアーカイブログファイルがバックアップされ、バックアップされたアーカイブログが削除される', false);
	pushChoice('データベースのみがバックアップされる。アーカイブログはバックアップされない', true);
	sortChoice();
	
	// 221
	q_list.push(new Question('PDBに接続しているときに実行できるバックアップ操作を選択しなさい。',
	'GOLD参考書161Pを参照'));
	pushChoice('BACKUP CURRENT CONTROLFILE;', true);
	pushChoice('BACKUP ARCHIVELOG ALL;', false);
	pushChoice('BACKUP TABLESPACE UNDOTBS1;', false);
	pushChoice('BACKUP TABLESPACE TEMP;', false);
	pushChoice('BACKUP PLUGGABLE DATABASE pdb1;', false);
	sortChoice();
	
	// 222
	q_list.push(new Question('マルチテナント環境の障害に対するリカバリ動作に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書162Pを参照'));
	pushChoice('PDBがクラッシュすると、次回PDBをオープンする際にPDBのクラッシュリカバリが行われる', false);
	pushChoice('欠落した一時ファイルの自動作成は、CDB／PDBがオープンするときに行われる', true);
	pushChoice('ルートコンテナのSYSTEM表領域に属するデータファイル障害では、ルートコンテナのみ停止が必要', false);
	pushChoice('クローズできないPDBのSYSTEM表領域に属するデータファイル障害では、CDBの停止が必要', true);
	pushChoice('UNDO表領域の障害では、PDBをオープンしたままリカバリすることができる', false);
	sortChoice();
	
	// 223
	q_list.push(new Question('マルチテナントのリカバリに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書163Pを参照'));
	pushChoice('ルートコンテナがオープンされるときにインスタンス障害に対するリカバリが実行される', true);
	pushChoice('インスタンス障害に対するリカバリでは、PDBがオープンされる前にPDBのトランザクションのロールバックが実行される', false);
	pushChoice('PDBで一時ファイルを明示的に再作成することはできない', false);
	pushChoice('バックアップ制御ファイルを使用したリカバリの後で、各PDBをRESETLOGSでオープンする', false);
	pushChoice('NOARCHIVELOGモードでは、特定のPDBファイルに障害が発生した場合でも、CDB全体（制御ファイルと全データファイル）をリストアすることになる', true);
	sortChoice();
	
	// 224
	q_list.push(new Question('すべてのPDBを停止する可能性がある障害を4つ選択しなさい。',
	'GOLD参考書164Pを参照'));
	pushChoice('ルートコンテナのSYSTEM表領域', true);
	pushChoice('ルートコンテナのSYSAUX表領域', false);
	pushChoice('PDBのSYSTEM表領域', true);
	pushChoice('PDBのSYSAUX表領域', false);
	pushChoice('PDBのUNDO表領域', false);
	pushChoice('制御ファイル', true);
	pushChoice('現行REDOロググループ', true);
	sortChoice();
	
	// 225
	q_list.push(new Question('PDBのデータファイル障害に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書165Pを参照'));
	pushChoice('PDBがクローズ時にSYSTEM表領域をリカバリするにはCDBをマウントする', false);
	pushChoice('PDBがオープン時にSYSTEM表領域をリカバリするにはCDBをマウントする', true);
	pushChoice('PDBの非SYSTEM表領域の障害はルートコンテナからのみリカバリできる', false);
	pushChoice('PDBの非SYSTEM表領域の障害はルートコンテナだけでなく対象PDBからもリカバリできる', true);
	pushChoice('PDBのファイル障害はPDB全体をリカバリする必要がある', false);
	sortChoice();
	
	// 226
	q_list.push(new Question('マルチテナント環境におけるデータリカバリアドバイザについて正しい説明を2つ選んでください。',
	'GOLD参考書165Pを参照'));
	pushChoice('CDB$ROOTに接続してデータリカバリアドバイザを使用すると、CDB$ROOTの障害のみが表示される', false);
	pushChoice('CDB$ROOTに接続してデータリカバリアドバイザを使用すると、CDB$ROOTおよびPDBの障害が表示される', true);
	pushChoice('CDB$ROOTに接続してデータリカバリアドバイザを使用すると、エラーが発生し、正常に実行できない', false);
	pushChoice('PDBに接続してデータリカバリアドバイザを使用すると、CDB#ROOTの障害のみが表示される', false);
	pushChoice('PDBに接続してデータリカバリアドバイザを使用すると、CDB#ROOTおよびPDBの障害が表示される', false);
	pushChoice('PDBに接続してデータリカバリアドバイザを使用すると、エラーが発生し、正常に実行できない', true);
	sortChoice();
	
	// 227
	q_list.push(new Question('マルチテナント環境で可能なPoint-in-Timeリカバリを3つ選択しなさい。',
	'GOLD参考書166Pを参照'));
	pushChoice('CDB全体', true);
	pushChoice('PDB全体', true);
	pushChoice('ルートコンテナの各表領域', false);
	pushChoice('PDB内の各表領域', false);
	pushChoice('ユーザーデータ用表領域', true);
	sortChoice();
	
	// 228
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nRMAN> connect target /'
	+ '\nRMAN> ALTER PLUGGABLE DATABASE pdb1 CLOSE;'
	+ '\nRMAN> RUN{'
	+ '\n2  SET UNTIL SCN 2332059;'
	+ '\n3  RESTORE PLUGGABLE DATABASE pdb1;'
	+ '\n4  RECOVER PLUGGABLE DATABASE pdb1'
	+ '\n5    AUXILIARY DESTINATION "/disk3";'
	+ '\n6 }'
	+ '\nRMAN> ALTER PLUGGABLE DATABASE pdb1 OPEN RESETLOGS;'
	+ '\n'
	+ '\n上記のコマンドの実行に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書167Pを参照'));
	pushChoice('REDOログファイルの再作成が行われる', false);
	pushChoice('REDOログのログ順序番号が1にリセットされる', false);
	pushChoice('PDBのインカーネーション番号が変更される', true);
	pushChoice('CDBのインカーネーション番号が変更される', false);
	pushChoice('制御ファイルの内容が変更される', true);
	sortChoice();
	
	// 229
	q_list.push(new Question('マルチテナントのフラッシュバックデータベースに関する説明として正しいものを選択しなさい。',
	'GOLD参考書168Pを参照'));
	pushChoice('ルートコンテナのみをフラッシュバックすることができる', false);
	pushChoice('ルートコンテナのみがフラッシュバックされる', false);
	pushChoice('フラッシュバックデータベースはPDBごとに有効化できる', false);
	pushChoice('PDB PITRターゲット以前でもそのままフラッシュバックできる', false);
	pushChoice('RESETLOGS前にPDBをREAD ONLYでオープンすることができる', true);
	sortChoice();
	
	// 230
	q_list.push(new Question('これまで正常なパフォーマンスを維持してきたデータベースにおいて、予期しないパフォーマンスのダウンが発生しました。'
	+ '\nパフォーマンスが正常だった時間帯とパフォーマンスがダウンしていた時間帯を比較して、パフォーマンスダウンの原因を特定することを考えています。'
	+ '\nこの目的に最も適切なツールを選択してください。',
	'GOLD参考書169Pを参照'));
	pushChoice('AWRレポート', false);
	pushChoice('データベースリプレイ', false);
	pushChoice('リアルタイムADDM', false);
	pushChoice('期間比較ADDM', true);
	pushChoice('リソースマネージャ', false);
	sortChoice();
	
	// 231
	q_list.push(new Question('これまで正常なパフォーマンスを維持してきたデータベースにおいて、予期しない著しいパフォーマンスのダウンが発生しました。'
	+ '\nデータベースに接続することもできない状況です。'
	+ '\nこの問題の分析をすみやかに行うために、最も適切なツールを選択してください。',
	'GOLD参考書170Pを参照'));
	pushChoice('直近のAWRレポート', false);
	pushChoice('ASH', false);
	pushChoice('データリカバリアドバイザ', false);
	pushChoice('リアルタイムADDM', true);
	pushChoice('SQLパフォーマンスアナライザ', false);
	sortChoice();
	
	// 232
	q_list.push(new Question('PDB間で制限できるリソースを2つ選択しなさい。',
	'GOLD参考書171Pを参照'));
	pushChoice('CPUリソース', true);
	pushChoice('UNDO使用量', false);
	pushChoice('パラレル実行サーバー', true);
	pushChoice('アクティブセッションタイム', false);
	pushChoice('アイドル時間', false);
	sortChoice();
	
	// 233
	q_list.push(new Question('CDBリソース計画の定義内で、PDBに割り当てたリソースを制限するディレクティブを2つ選択しなさい。',
	'GOLD参考書171Pを参照'));
	pushChoice('max_utilization_limit', false);
	pushChoice('utilization_limit', true);
	pushChoice('parallel_target_percentage', false);
	pushChoice('parallel_server_limit', true);
	pushChoice('parallel_servers_target', false);
	sortChoice();
	
	// 234
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nDBMS_RESOURCE_MANAGER.UPDATE_CDB_AUTOTASK_DIRECTIVE('
	+ '\n  plan                      => "daytime_plan",'
	+ '\n  new_shares                => 1,'
	+ '\n  new_utilization_limit     => 75,'
	+ '\n  new_parallel_server_limit => 50);'
	+ '\n'
	+ '\n上記のコマンドを実行した結果として正しいものを選択しなさい。',
	'GOLD参考書172Pを参照'));
	pushChoice('対象プラン内のすべてのディレクティブが変更される。', false);
	pushChoice('既存のディレクティブすべてが変更される', false);
	pushChoice('今後作成されるディレクティブに影響する', false);
	pushChoice('自動化メンテナンスタスクの実行に影響する', true);
	sortChoice();
	
	// 235
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> SELECT plan, pluggable_database "PDB"'
	+ '\n  2         shares, utilization_limit, paralell_server_limit'
	+ '\n  3  FROM dba_cdb_rsrc_plan_directives;'
	+ '\n'
	+ '\nPLAN             PDB                        SHA  UTI  PAR'
	+ '\n---------------- ------------------------- ---- ---- ----'
	+ '\n...'
	+ '\nDAYTIME_PLAN     ORA$AUTOTASK                     90  100'
	+ '\nDAYTIME_PLAN     PDB1                         1  100   70'
	+ '\nDAYTIME_PLAN     PDB2                         2'
	+ '\nDAYTIME_PLAN     PDB3                         1   50   80'
	+ '\nDAYTIME_PLAN     ORA$DEFAULT_PDB_DIRECTIVE    1   20  100'
	+ '\n'
	+ '\nこの環境に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書173Pを参照'));
	pushChoice('PDBに割り当てられたリソースは無制限で利用できる', false);
	pushChoice('ORA$AUTOTASKのshare値は「1」が設定される', false);
	pushChoice('ORA$AUTOTASKとORA$DEFAULT_PDB_DIRECTIVEは自動で作成される', true);
	pushChoice('PDB2にはほかのPDBの2倍のリソース割り当てが行われる', true);
	sortChoice();
	
	// 236
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> SELECT plan, pluggable_database "PDB"'
	+ '\n  2         shares, utilization_limit, paralell_server_limit'
	+ '\n  3  FROM dba_cdb_rsrc_plan_directives;'
	+ '\n'
	+ '\nPLAN             PDB                        SHA  UTI  PAR'
	+ '\n---------------- ------------------------- ---- ---- ----'
	+ '\n...'
	+ '\nDAYTIME_PLAN     ORA$AUTOTASK                     90  100'
	+ '\nDAYTIME_PLAN     PDB1                         1  100   70'
	+ '\nDAYTIME_PLAN     PDB2                         2'
	+ '\nDAYTIME_PLAN     PDB3                         1   50   80'
	+ '\nDAYTIME_PLAN     ORA$DEFAULT_PDB_DIRECTIVE    1   20  100'
	+ '\n'
	+ '\nこの環境に関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書173Pを参照'));
	pushChoice('PDBに割り当てられたリソースは無制限で利用できる', false);
	pushChoice('ORA$AUTOTASKのshare値は「1」が設定される', false);
	pushChoice('ORA$AUTOTASKとORA$DEFAULT_PDB_DIRECTIVEは自動で作成される', true);
	pushChoice('PDB2にはほかのPDBの2倍のリソース割り当てが行われる', true);
	sortChoice();
	
	// 237
	q_list.push(new Question('CDBリソース計画を有効化する方法として正しいものを2つ選択しなさい。',
	'GOLD参考書174Pを参照'));
	pushChoice('各PDBのresource_manager_planパラメータにCDBリソース計画を設定する', false);
	pushChoice('ルートコンテナでresource_manager_planパラメータにCDBリソース計画を設定する', true);
	pushChoice('サービスを使用してCDBリソース計画を設定する', false);
	pushChoice('スケジューラのジョブクラスを使用してCDBリソース計画を設定する', false);
	pushChoice('スケジューラのウィンドウを使用してCDBリソース計画を設定する', true);
	sortChoice();
	
	// 238
	q_list.push(new Question('PDBレベルで設定するリソースマネージャーに関する説明として正しいものを3つ選択しなさい。',
	'GOLD参考書174Pを参照'));
	pushChoice('単一レベルのリソース計画のみ可能', true);
	pushChoice('複数レベルのリソース計画が可能', false);
	pushChoice('1つのプランで最大8つのコンシューマグループまで可能', true);
	pushChoice('1つのプランで9つ以上のコンシューマグループも可能', false);
	pushChoice('サブプランを設定できない', true);
	pushChoice('サブプランを設定できる', false);
	sortChoice();
	
	// 239
	q_list.push(new Question('リソース計画が構成済みの非CDBをPDBに変換する際の扱いとして正しいものを2つ選択しなさい。',
	'GOLD参考書175Pを参照'));
	pushChoice('PDBの制限に違反していなければディクショナリに保存されるが使用できない', false);
	pushChoice('PDBの制限に違反していなければそのまま使用される', true);
	pushChoice('PDBの制限に違反している場合は同等の計画に変換される', true);
	pushChoice('PDBの制限に違反している場合はPDBへの変換エラーとなる', false);
	pushChoice('PDBの制限に違反している場合はディクショナリから削除される', false);
	sortChoice();
	
	// 240
	q_list.push(new Question('次の実行結果を確認してください。'
	+ '\n'
	+ '\nSQL> SELECT tablespace_name, file_name FROM dba_data_files;'
	+ '\n'
	+ '\nTABLESPACE_NAME FILE_NAME'
	+ '\n--------------- -------------------------------------------'
	+ '\nSYSTEM          /u01/app/oracle/oradata/orcl/system01.dbf'
	+ '\nSYSAUX          /u01/app/oracle/oradata/orcl/sysaux01.dbf'
	+ '\nSALES01         /u01/app/oracle/oradata/orcl/sales01.dbf'
	+ '\nUSERS           /u01/app/oracle/oradata/orcl/users01.dbf'
	+ '\nEXAMPLE         /u01/app/oracle/oradata/orcl/example01.dbf'
	+ '\nUNDOTBS1        /u01/app/oracle/oradata/orcl/undotbs1.dbf'
	+ '\nSALES02         /u01/app/oracle/oradata/orcl/sales02.dbf'
	+ '\n'
	+ '\n$ expdp system DUMPFILE=full.dmp FULL=y TRANSPORTABLE=always'
	+ '\n'
	+ '\nexpdpコマンド実行によりエクスポートされる表領域を選択しなさい。'
	+ '\n'
	+ '\n',
	'GOLD参考書176Pを参照'));
	pushChoice('SYSTEM、SYSAUX、UNDOTBS1、USERS、EXAMPLE、SALES01、SALES02', false);
	pushChoice('SYSTEM、SYSAUX、UNDOTBS1、USERS', false);
	pushChoice('USERS、EXAMPLE、SALES01、SALES02', true);
	pushChoice('EXAMPLE、SALES01、SALES02', false);
	pushChoice('SALES01、SALES02', false);
	sortChoice();
	
	// 241
	q_list.push(new Question('全体トランスポータブルに関する説明として正しいものを2つ選択しなさい。',
	'GOLD参考書177Pを参照'));
	pushChoice('ユーザー定義表領域はすべて読み取り専用にする必要がある', true);
	pushChoice('異なるエンディアン形式のデータベースに転送することはできない', false);
	pushChoice('Oracle Database 11gのデータベースをソースにする場合はVERSION=12を指定する', true);
	pushChoice('NETWORK_LINKを使用した転送はサポートされていない', false);
	sortChoice();
	
	// 242
	q_list.push(new Question('以下のコマンドを実行したときの動作について正しい説明を選んでください。'
	+ '\n'
	+ '\n$ expdp SYSTEM/Password123@PDB1 FULL=YES TRANSPORTABLE=ALWAYS'
	+ '\n>   DUMPFILE=dpdir1:fullexp1%U.dmp, dpdir2:fullexp2%U.dmp, dpdir3:fullexp3%U.dmp'
	+ '\n>   FILESIZE=400M PARALELL=3 JOB_NAME=fullexp',
	'GOLD参考書178Pを参照'));
	pushChoice('DUMPFILEには複数のファイルを指定できないため、コマンドは失敗する', false);
	pushChoice('DUMPFILEのファイル名に使用できない記号が含まれているため、コマンドは失敗する', false);
	pushChoice('PDBに対して完全トランスポータブルを実行できないため、コマンドは失敗する', false);
	pushChoice('3つのダンプファイルについて並列度3でエクスポート処理が同時実行される', true);
	pushChoice('1つのダンプファイルについて並列度3でエクスポート処理が同時実行される。ダンプファイルのファイルサイズが400Mに達したら、引き続き別のダンプファイルに対して並列度3でエクスポート処理が実行される', false);
	sortChoice();
	
	// 243
	q_list.push(new Question('SQL*Loaderの特徴について正しいものをすべて選んでください。',
	'GOLD参考書178Pを参照'));
	pushChoice('PDBに対する1つのロード実行で使用できるデータファイルは1つのみです', false);
	pushChoice('ロード処理を実行するためには必ず制御ファイルが必要です', false);
	pushChoice('データファイルのキャラクタセットは、データベースのキャラクタセットと一致している必要があります', false);
	pushChoice('条件に合致するデータのみを選択的にロードできます', true);
	pushChoice('ロード時にデータに連番を付与できます', true);
	sortChoice();
	
	// 244
	q_list.push(new Question('複数の非CDBをPDBとしてマルチテナント環境に統合することを検討しています。'
	+ '\n統合後、性能上の問題が出ないかどうかをあらかじめ調査する方法として、適切なものを選んでください。'
	+ '\nなお、調査のために統合環境と同等のハードウェアをテスト環境として使用できるものとします。',
	'GOLD参考書179Pを参照'));
	pushChoice('AWRレポートを参考に最も負荷の高いSQL文を選び、テストシステムでSQLパフォーマンスアナライザを使用する', false);
	pushChoice('AWRレポートを参考に最も負荷の高いSQL文を選び、テストシステムでSQLチューニングアナライザを使用する', false);
	pushChoice('それぞれの非CDBの本番ワークロードをキャプチャし、データベースリプレイでワークロードを再生することを非CDBの数だけ繰り返す', false);
	pushChoice('それぞれの非CDBの本番ワークロードをキャプチャし、データベース統合リプレイを使用して、すべてのPDBのすべての実動システムのワークロードを同時に再生する', true);
	pushChoice('CDBのリソース計画を構成して、各PDBが使用できるリソースを制限する', false);
	sortChoice();
	
	// 245
	q_list.push(new Question('統合監査について正しい説明をすべて選んでください。',
	'GOLD参考書180Pを参照'));
	pushChoice('デフォルトでSQL*Loaderダイレクトパスロード操作について監査が取得されます', false);
	pushChoice('デフォルトでRMANバックアップ操作について監査が取得されます', true);
	pushChoice('監査証跡は、SYSTEM表領域に保管されます', false);
	pushChoice('監査証跡は、SYSAUX表領域に保管されます', true);
	pushChoice('完全な統合監査モードへ移行するためには、初期化パラメータUNFIED_AUDITをTRUEに設定します', false);
	pushChoice('AUDIT POLICY文を実行して、どのユーザーに対して監査ポリシーを適用するかを指定します', true);
	sortChoice();
	
	// 246
	q_list.push(new Question('次のコマンドに関する説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nSQL> ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;',
	'SILVER参考書119Pを参照'));
	pushChoice('CURRENT、ACTIVEなステータスのREDOロググループでは実行できない', false);
	pushChoice('コマンド後にデータベース全体の完全バックアップを取得する必要がある', true);
	pushChoice('アーカイブログが作成されていなくても、REDOロググループが消去される', true);
	pushChoice('REDOロググループ数が2つの場合は実行できない', false);
	sortChoice();
	
	// 247
	q_list.push(new Question('ADDMに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書134Pを参照'));
	pushChoice('AWRスナップショット作成後に自動で実行される', true);
	pushChoice('データ障害に対する診断と修復オプションを提供する', false);
	pushChoice('必要以上に領域を使用している表や索を検索する', false);
	pushChoice('予防的なデータベースの監視のためのボトルネックの検出と解決方法を提供する', true);
	sortChoice();
	
	// 248
	
	q_list.push(new Question('データベースの再起動に関係なくDBA_OUTSTANDING_ALERTSビューで確認できるアラートを2つ選択しなさい。',
	'SILVER参考書137Pを参照'));
	pushChoice('「スナップショットが古すぎます」アラート', false);
	pushChoice('再開可能セッションの一時停止アラート', false);
	pushChoice('メトリックベースのアラート', true);
	pushChoice('「リカバリ領域の空き容量が不足しています」アラート', false);
	pushChoice('表領域の使用率アラート', true);
	sortChoice();
	
	// 249
	q_list.push(new Question('Oracle Database 12cのAWRスナップショットに関する説明として正しいものを選択しなさい。',
	'SILVER参考書138Pを参照'));
	pushChoice('スナップショット間隔を0に設定すると自動スナップショットの取得ができなくなるが、手動でのスナップショット作成は可能である', false);
	pushChoice('保存期間を0に設定するとSYSAUX表領域の空き領域が不足している場合、自動的に古いスナップショットセットから削除される', true);
	pushChoice('保存期間を0に設定すると自動パージが無効になる', false);
	pushChoice('上位SQL文はデフォルトですべて取得される', false);
	pushChoice('デフォルトで7日間保持される', false);
	sortChoice();
	
	// 250
	q_list.push(new Question('自動化メンテナンスタスクで自動実行されるタスクを3つ選択しなさい。',
	'SILVER参考書140Pを参照'));
	pushChoice('ADDM', false);
	pushChoice('オプティマイザ統計の収集', true);
	pushChoice('セグメントアドバイザ', true);
	pushChoice('SQLアクセスアドバイザ', false);
	pushChoice('自動SQLチューニング', true);
	sortChoice();
	
	// 251
	q_list.push(new Question('SQLパフォーマンスアナライザやデータベースリプレイの実行が適切なシナリオを3つ選択しなさい。',
	'SILVER参考書143Pを参照'));
	pushChoice('データベースのアップグレードのテスト', true);
	pushChoice('異なるデータベースバージョンにおけるテスト', true);
	pushChoice('クライアントアプリケーション変更におけるテスト', false);
	pushChoice('異なるハードウェアにおけるテスト', true);
	pushChoice('非RAC環境のネットワーク帯域幅変更におけるテスト', false);
	sortChoice();
	
	//252
	q_list.push(new Question('Oracle Database 12cのオプティマイザに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書144Pを参照'));
	pushChoice('初回のハード解析時にのみ適応問い合わせ最適化が実行される', false);
	pushChoice('2回目以降の同一SQL実行時でも適応問い合わせ最適化によるハード解析が施行される', true);
	pushChoice('optimizer_adaptive_reporting_only=FALSEの場合に適応問い合わせ最適化が使用される', true);
	pushChoice('オプティマイザ統計情報がロックされていない場合に適応計画が使用される', false);
	sortChoice();
	
	// 253
	q_list.push(new Question('SQL計画ディレクティブに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書144Pを参照'));
	pushChoice('SYSAUX表領域に保存される', true);
	pushChoice('特定のSQLにのみ対応する', false);
	pushChoice('一定期間使用されないと自動で削除される', true);
	pushChoice('明示的にフラッシュする必要がある', false);
	pushChoice('ADDMによって取得される', false);
	sortChoice();
	
	// 254
	q_list.push(new Question('オプティマイザ統計を収集することで実行計画が変化する可能性のあるSQL文があります。'
	+ '\n影響を検証し、問題のないことを確認してから新しい実行計画を使用する方法として正しいものを選択しなさい。',
	'SILVER参考書147Pを参照'));
	pushChoice('OPTIMIZER_USE_PENDING_STATISTICSパラメータをTRUEにして統計を収集する', false);
	pushChoice('PUBLISHプリファレンスをFALSEにして統計を収集する', true);
	pushChoice('OPTIMIZER_USE_SQL_PLAN_BASELINESパラメータをFALSEにして統計を収集する', false);
	pushChoice('自動メンテナンスタスクのウィンドウ時間を変更する', false);
	sortChoice();
	
	// 255
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\nSQL> exec DBMS_STATS.SET_TABLE_PREFS("SH", "SALES", "PUBLISH", "FALSE")'
	+ '\n'
	+ '\n今後の動作として正しい説明を選択しなさい。',
	'SILVER参考書152Pを参照'));
	pushChoice('今後のオプティマイザ統計収集では、FORCEオプションをTRUEにしない限りエラーとなる', false);
	pushChoice('今後のオプティマイザ統計収集はプライベート領域に保存され、DBMS_STATS.PUBLISH_PENDING_STATSを使用して公開するまで使用されない', true);
	pushChoice('今後のオプティマイザ統計収集では履歴情報が保存されないため、リストアできなくなる', false);
	pushChoice('今後収集するオプティマイザ統計情報を使用できるのはSHユーザーのみで、その他のユーザーは利用できなくなる', false);
	sortChoice();
	
	// 256
	q_list.push(new Question('Oracle Database 12cの自動化メンテナンスタスクによるオプティマイザ統計収集に関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書156Pを参照'));
	pushChoice('オブジェクト統計とシステム統計が収集される', false);
	pushChoice('リソース使用率の上限までの範囲で、複数のセグメントや複数のパーティションに対する同時実行性が利用される', true);
	pushChoice('データが5％以上変更されているセグメントが対象になる', false);
	pushChoice('オプティマイザ統計情報が欠落または失効しているセグメントが対象になる', true);
	sortChoice();
	
	// 257
	q_list.push(new Question('オプティマイザによる実行計画作成に影響を与えるものを2つ選択しなさい。',
	'SILVER参考書157Pを参照'));
	pushChoice('OS統計情報', false);
	pushChoice('初期化パラメータ', true);
	pushChoice('SQLプロファイル', false);
	pushChoice('オプティマイザ統計情報', true);
	pushChoice('SQL計画ベースライン', false);
	sortChoice();
	
	// 258
	q_list.push(new Question('自動SQLチューニングに関する説明として正しいものを選択しなさい。',
	'SILVER参考書158Pを参照'));
	pushChoice('SQLプロファイル、オプティマイザ統計収集、索引の追加、SQL文の再構築が自動で行われる', false);
	pushChoice('メンテナンスウィンドウによって実行される', true);
	pushChoice('SQLチューニングアドバイザとSQLアクセスアドバイザが実行される', false);
	pushChoice('対象となるSQLは、SQLチューニングセットで決定される', false);
	sortChoice();
	
	// 259
	q_list.push(new Question('アプリケーションの終了指示が不適切なためにロック取得したままのセッションが多数あるという報告がありました。'
	+ '\nロック競合も多いため、それらのセッションを一定時間で切断する必要があります。'
	+ '\n実現方法として適切なものを選択しなさい。',
	'SILVER参考書161Pを参照'));
	pushChoice('Blocked User Session Countメトリックのしきい値', false);
	pushChoice('リソースマネージャーのMAX_IDLE_BLOCKER_TIMEディレクティブ', true);
	pushChoice('プロファイルのIDLE_TIMEリソースパラメータ', false);
	pushChoice('RESUMABLE_TIMEOUTパラメータによる再開可能領域割り当て', false);
	sortChoice();
	
	// 260
	q_list.push(new Question('リソースマネージャーに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書161Pを参照'));
	pushChoice('自動化メンテナンスタスクで使用するメンテナンスウィンドウがオープンすると、DEFAULT_MAINTENANCE_PLANが割り当てられる', true);
	pushChoice('アクティブなリソースプランの一部ではないコンシューマグループに属するユーザーはOTHER_GROUPSとして処理される', true);
	pushChoice('デフォルトでユーザーの初期コンシューマグループとしてOTHER_GROUPSが設定されている', false);
	pushChoice('SYSユーザーのみ、デフォルトで初期コンシューマグループとしてSYS_GROUPグループが設定されている', false);
	sortChoice();
	
	// 261
	q_list.push(new Question('リソースプランの有効化に関する説明として正しいものを選択しなさい。',
	'SILVER参考書162Pを参照'));
	pushChoice('リソースプランの変更を有効にするにはインスタンスを再起動する必要がある', false);
	pushChoice('RESOURCE_MANAGER_PLAN初期化パラメータをインスタンスレベルで変更する', true);
	pushChoice('存在しないリソースプランで変更しようとすると無視され、デフォルトのプランが有効になる', false);
	pushChoice('リソースプランの未設定時は、DEFAULT_PLANがアクティブになる', false);
	sortChoice();
	
	// 262
	q_list.push(new Question('リソースマネージャを使用することで可能な処理として正しいものを2つ選択しなさい。',
	'SILVER参考書163Pを参照'));
	pushChoice('しきい値を超えると自動でコンシューマグループを切り替え、処理後にグループを戻すことができる', true);
	pushChoice('ブロッキング状態のセッションで原因となったSQL文をエラーにすることができる', false);
	pushChoice('プランに含まれているグループのセッションが存在しないときに使用するCPU使用量の上限を設定できる', true);
	pushChoice('各セッションで使用するUNDO使用量に制限を設け、超えたらセッションを切断することができる', false);
	sortChoice();
	
	// 263
	q_list.push(new Question('リソースマネージャによるインスタンスケージングに必要な構成を2つ選択しなさい。',
	'SILVER参考書164Pを参照'));
	pushChoice('CPU_COUNT初期化パラメータ', true);
	pushChoice('mgmt_p1を使用したCPU使用量のディレクティブ', false);
	pushChoice('リソースプランの有効化', true);
	pushChoice('コンシューマグループマッピング', false);
	sortChoice();
	
	// 264
	q_list.push(new Question('Oracleソフトウェアのインストールに関する説明として適切なものを2つ選択しなさい。',
	'SILVER参考書175Pを参照'));
	pushChoice('Oracle Restartを使用するにはGrid Infrastructureを先にインストールする必要がある', false);
	pushChoice('Oracle Restartを使用する場合、Grid Infrastructureを先にインストールすることが推奨される', true);
	pushChoice('ASMを使用する場合、Grid Infrastructureが必須である', true);
	pushChoice('Grid InfrastructureとOracle Databaseは異なるマシンにインストールすることができる', false);
	sortChoice();
	
	// 265
	q_list.push(new Question('Oracle Databaseソフトウェアをインストール前にGrid Infrastructureをスタンドアローンモードでインストールする利点を2つ選択しなさい。',
	'SILVER参考書176Pを参照'));
	pushChoice('データベースの起動、停止、再起動の自動化', true);
	pushChoice('データベースファイルの作成や削除の自動化', false);
	pushChoice('非クラスタデータベースをクラスタデータベースに変更', false);
	pushChoice('ブロックデバイスやRAWデバイスを使用させない', true);
	sortChoice();
	
	// 266
	q_list.push(new Question('次の要件を満たすためにインストールする必要があるソフトウェアを選択しなさい。'
	+ '\n'
	+ '\nインスタンス障害時は即時に再起動する'
	+ '\nRAIDを使用せずにディスクストライプ化とミラー化を行う',
	'SILVER参考書176Pを参照'));
	pushChoice('WebLogic Application Server', false);
	pushChoice('Database Vault', false);
	pushChoice('Enterprise Manager Cloud Control', false);
	pushChoice('Grid Infrastracture', true);
	sortChoice();
	
	// 267
	q_list.push(new Question('Oracle Database 12cのOracle Universal Installerをサイレントモードでインストールする必要があります。'
	+ '\nレスポンスファイルの準備方法として適切なものを2つ選択しなさい。',
	'SILVER参考書178Pを参照'));
	pushChoice('インストールメディア内のテンプレートファイルをカスタマイズする', true);
	pushChoice('OUIの実行時引数ですべてを渡す必要がある', false);
	pushChoice('GUIモードで実行した最後のサマリーページで「レスポンスファイルの保存」にて保存しておく', true);
	pushChoice('GUIモードで起動するときに -record -destinationFileを指定して保存しておく', false);
	sortChoice();
	
	// 268
	q_list.push(new Question('2つのOracleホームがあり、それぞれのデータベース管理者権限グループを分ける必要があります。'
	+ '\n対応させる方法として適切なものを選択しなさい。',
	'SILVER参考書178Pを参照'));
	pushChoice('同一ハードウェア上のデータベース管理者グループは1つしか持てないため、分けることはできない', false);
	pushChoice('インベントリ用グループを作成し、プライマリグループとして設定する', true);
	pushChoice('インベントリグループのみのユーザーを作成し、データベース管理者と分ける', false);
	pushChoice('すべての管理者グループに属するユーザーでOracleソフトウェアをインストールする', false);
	sortChoice();
	
	// 269
	q_list.push(new Question('Oracle Linux環境にOracleソフトウェアをインストールするにあたり、Oracle Universal Installerで行うことのできる処理を2つ選択しなさい。',
	'SILVER参考書179Pを参照'));
	pushChoice('OSユーザー、OSグループの作成', false);
	pushChoice('カーネルパラメータやシェル制限などの修正', true);
	pushChoice('ルートファイルシステムにディレクトリを追加', false);
	pushChoice('レスポンスファイルの保存', true);
	sortChoice();
	
	// 270
	q_list.push(new Question('Oracle Database 12.1のOracle Database ソフトウェアをOracle Linux環境にインストールします。'
	+ '\n事前に作成したOSグループを対応付ける必要のあるOracle権限グループをすべて含むものを選択しなさい。',
	'SILVER参考書179Pを参照'));
	pushChoice('OSDBA、OSOPER、OSBACKUP、OSDGDBA、OSKMDBA', false);
	pushChoice('OSDBA、OSBACKUP、OSDGDBA、OSKMDBA', true);
	pushChoice('OSDBA、OSOPER、OSBACKUP', false);
	pushChoice('OSDBA、OSBACKUP', false);
	pushChoice('OSDBA、OSOPER', false);
	pushChoice('OSDBA', false);
	sortChoice();
	
	// 271
	q_list.push(new Question('Oracle Linux 6にOracle RDBMS Pre-Install RPMをインストールすると行われる処理について正しいものを2つ選択しなさい。',
	'SILVER参考書180Pを参照'));
	pushChoice('Oracle DatabaseやOracle Grid Infrastrucureのインストールに必要なOSパッケージを自動でインストールする', true);
	pushChoice('Oracleソフトウェアをデフォルト構成で自動インストールする', false);
	pushChoice('oinstallグループの作成とインベントリディレクトリの作成を自動で行う', false);
	pushChoice('oracleユーザーとdbaグループの作成を自動で行う', true);
	sortChoice();
	
	// 272
	q_list.push(new Question('データベースの削除に関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書185Pを参照'));
	pushChoice('DBCAを使用して削除する場合、対象となるデータベースは停止しておく必要がある', false);
	pushChoice('DROP DATABASE文を使用する場合、対象となるデータベースはRESTRICTモードでマウントしておく必要がある', true);
	pushChoice('RMANを使用してDROP DATABASE文を使用する場合、アーカイブログファイルやバックアップファイルも削除される', true);
	pushChoice('DBCAを使用して削除する場合、削除完了後にOSを再起動する必要がある', false);
	sortChoice();
	
	// 273
	q_list.push(new Question('Linux環境でデータベースを作成します。'
	+ '\nDBCAによるデータベース作成に関する説明として適切なものを3つ選択しなさい。',
	'SILVER参考書187Pを参照'));
	pushChoice('拡張モードにて「データベース作成スクリプトの生成」を選択する場合、/etc/oratabファイルは変更されない', true);
	pushChoice('「データベースの作成」と「データベース作成スクリプトの生成」は同時に選択することはできない', false);
	pushChoice('ファイルシステムにデータベースファイルを保存する場合、初期化パラメータファイルはSPFILEのみ作成される', true);
	pushChoice('ASMにデータベースファイルを保存する場合、テキスト形式のPFILEとバイナリ形式のSPFILEの両方が作成される', true);
	sortChoice();
	
	// 274
	q_list.push(new Question('Oracle Database 12.1.0.1のDBCAを使用して、コンテナデータベースとしてデータベースを作成しました。'
	+ '\nデータベースに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書188Pを参照'));
	pushChoice('グローバルデータベース名とPDB名のネットサービス名がtnsnames.oraファイルに登録される', false);
	pushChoice('グローバルデータベース名とPDB名のサービス名がリスナーに登録される', true);
	pushChoice('PDBを自動起動するためのデータベーストリガーが自動で作成される', false);
	pushChoice('DBCAによる作成直後のPDBはオープンしている', true);
	sortChoice();
	
	// 275
	q_list.push(new Question('DBCAでコンテナデータベースとしてデータベースを作成し、Enterprise Manager Database Expressの構成を選択しました。'
	+ '\n構成されたEnterprise Manager Database Expressを使用した操作として可能なものを2つ選択しなさい。',
	'SILVER参考書189Pを参照'));
	pushChoice('ルートコンテナと各PDBの表領域を作成', false);
	pushChoice('各PDBのローカルユーザーに権限を付与', false);
	pushChoice('ルートコンテナにて共通ユーザーを作成', true);
	pushChoice('CDB全体とPDBのパフォーマンスデータの確認', true);
	sortChoice();
	
	// 276
	q_list.push(new Question('次のデータベースの文字コードに関する説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nSQL> SELECT * FROM nls_database_parameters'
	+ '\n  2  WHERE parameter LIKE "%CHARACTERSET%";'
	+ '\n'
	+ '\nPARAMETR                     VALUE'
	+ '\n---------------------------- --------------'
	+ '\nNLS_NCHAR_CHARACTERSET       AL16UTF16'
	+ '\nNLS_CHARACTERSET             AL32UTF8',
	'SILVER参考書191Pを参照'));
	pushChoice('AL16UTF16を使用すると常に2バイトで格納される', false);
	pushChoice('NCHAR型やNVARCHAR2型を使用した場合のみUnicodeが使用される', false);
	pushChoice('SQLやPL/SQLのVARCHAR2型やCHAR型は可変幅の1バイト～4バイトで表現される', true);
	pushChoice('AL16UTF16をNLS_CHARACTERSETで設定することはできない', true);
	sortChoice();
	
	// 277
	q_list.push(new Question('Oracle RestartをインストールしているOracle Linux環境において、OS起動後にデータベースが自動起動していないという苦情が発生しています。'
	+ '\n次の結果から今後の対応として適切なものを選択しなさい。'
	+ '\n'
	+ '\n$ ps -ef | grep ohasd'
	+ '\nroot      9672  7187  0 16:14 pts/0    00:00:00 grep ohasd'
	+ '\nroot     24131     1  0 15:44 ?        00:00:00 /bin/sh /etc/init.d/init.ohasd run'
	+ '\n'
	+ '\n$ cat /etc/oracle/scls_scr/sti01/grid/ohasdstr'
	+ '\ndisable',
	'SILVER参考書192Pを参照'));
	pushChoice('crsctl start hasでOHASDを起動する', false);
	pushChoice('crsctl enable hasで自動起動を有効化する', true);
	pushChoice('crsctl config hasで自動起動を有効化する', false);
	pushChoice('/etc/init.d/init/ohasd startで自動起動を有効化する', false);
	sortChoice();
	
	// 278
	q_list.push(new Question('次のコマンドを確認してください。'
	+ '\n'
	+ '\n$ crsctl stop has'
	+ '\n'
	+ '\nコマンドの実行後の状態として適切なものを選択しなさい。',
	'SILVER参考書193Pを参照'));
	pushChoice('ohasd.binのみが停止した状態となる', false);
	pushChoice('Oracle Restartコンポーネントが強制停止され、ohasd.binが停止する', false);
	pushChoice('Oracle Restartコンポーネントが依存関係に基づき正常停止され、ohasd.binが停止する', true);
	pushChoice('ohasd.binのみが停止し、OSが停止する', false);
	sortChoice();
	
	// 279
	q_list.push(new Question('Oracle Infrastructureホームのsrvctlコマンドを使用してOracle Restartに登録すべきコンポーネントを4つ選択してください。',
	'SILVER参考書194Pを参照'));
	pushChoice('データベースインスタンス', false);
	pushChoice('ASMインスタンス', true);
	pushChoice('ディスクグループ', true);
	pushChoice('データベースサービス', false);
	pushChoice('Oracle Netリスナー', true);
	pushChoice('Oracle Notification Services(ONS)', true);
	sortChoice();
	
	// 280
	q_list.push(new Question('Oracle Restartから自動的に構成削除される操作を2つ選択しなさい。',
	'SILVER参考書195Pを参照'));
	pushChoice('NETCAを使用したリスナーの削除', true);
	pushChoice('Net Managerを使用したリスナーの削除', false);
	pushChoice('SRVCTLを使用したデータベースサービスの削除', true);
	pushChoice('SERVICE_NAMES初期化パラメータの変更によるデータベースサービスの削除', false);
	pushChoice('DBMS_SERVICE.DELETE_SERVICEプロシージャによるデータベースサービスの削除', false);
	sortChoice();
	
	//281
	q_list.push(new Question('次のコマンドに関する説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\nsrvctl start home -oraclehome /u01/app/oracle/product/12.1.0/dbhome_1'
	+ '\n-statefile /home/oracle/dbhome1.dmp',
	'SILVER参考書195Pを参照'));
	pushChoice('/home/oracle/dbhome1.dmpは、事前にsrvctl stop homeまたはsrvctl status homeコマンドで作成しておく必要がある', true);
	pushChoice('/home/oracle/dbhome1.dmpは、事前にからのファイルとして作成しておく必要がある', false);
	pushChoice('/u01/app/oracle/product/12.1.0/dbhome_1配下で動作するコンポーネントがすべて対象となる', false);
	pushChoice('/u01/app/oracle/product/12.1.0/dbhome_1配下で動作し、/home/oracle/dbhome1.bmpに保存されたコンポーネントすべてが対象となる', true);
	sortChoice();
	
	// 282
	q_list.push(new Question('orclデータベースは、DATAディスクグループに格納されています。'
	+ '\n次のコマンドを実行した結果として適切なものを選択しなさい。'
	+ '\n'
	+ '\n$ srvctl stop diskgroup -diskgroup DATA',
	'SILVER参考書196Pを参照'));
	pushChoice('DATAディスクグループの停止は失敗するが、orclデータベースは停止される', false);
	pushChoice('DATAディスクグループの停止に失敗し、orclデータベースはオープンしたままとなる', true);
	pushChoice('orclデータベースが停止されたのち、DATAディスクグループが停止される', false);
	pushChoice('orclデータベースはオープンされたまま、DATAディスクグループが停止される', false);
	sortChoice();
	
	// 283
	q_list.push(new Question('次のコマンドの結果に関する説明として正しいものを選択しなさい。'
	+ '\n'
	+ '\n$ srvctl status database -db orcl'
	+ '\nデータベースは実行中です。',
	'SILVER参考書197Pを参照'));
	pushChoice('監視は有効であるが、インスタンスが起動しているかどうかは不明', false);
	pushChoice('監視は有効であるが、データベースがオープンしているかどうかは不明', false);
	pushChoice('インスタンスが起動しているが、データベースがオープンしているかどうかは不明', true);
	pushChoice('インスタンスが起動し、データベースがオープンしている', false);
	sortChoice();
	
	// 284
	q_list.push(new Question('TNS_ADMIN環境変数を使用してデフォルト以外のlistener.oraファイルを読み込んで起動するOracle Netリスナーがあります。'
	+ '\nOracle Restartを使用して管理したい場合に、適切な方法を選択しなさい。',
	'SILVER参考書198Pを参照'));
	pushChoice('Oracle Restart構成に環境変数を追加することはできない', false);
	pushChoice('Oracle Restartのラッパースクリプトに環境変数を追加する', false);
	pushChoice('NETCAでリスナーを登録する際に保存するlistener.oraファイルを指定する', false);
	pushChoice('srvctl setenv listenerコマンドを使用して環境変数を設定する', true);
	sortChoice();
	
	// 285
	q_list.push(new Question('次のコマンドに関する説明として正しいものを2つ選択しなさい。'
	+ '\n'
	+ '\n$ srvctl add service -db cdb1 -service pdb1serv -pdb pdb1',
	'SILVER参考書198Pを参照'));
	pushChoice('cdb1コンテナデータベースとpdb1プラガブルデータベース、pdb1servサービスの追加が行われる', false);
	pushChoice('cdb1データベースのOracleホーム配下のsrvctlを使用する必要がある', true);
	pushChoice('pdb1プラガブルデータベースに接続するためのpdb1servサービスが追加される', true);
	pushChoice('-pdb pdb1を指定しない場合、すべてのPDBに同じサービス名が追加される', false);
	sortChoice();
	
	// 286
	q_list.push(new Question('現在、ASMインスタンスとデータベースインスタンスが停止していることが確認されています。'
	+ '\nデータベースはDBCAを使ってASM記憶域で作成しています。'
	+ '\n次のコマンドの結果として正しいものを選択しなさい。'
	+ '\n'
	+ '\n$ srvctl start database -db orcl -startoption mount',
	'SILVER参考書199Pを参照'));
	pushChoice('ASMインスタンスが起動していないためエラーとなる', false);
	pushChoice('ASMインスタンスは起動するが、ASMディスクグループはマウントできないためエラーとなる', false);
	pushChoice('ASMインスタンスの起動とASMディスクグループのマウント、ASMリスナーの起動、データベースのマウントが行われる', true);
	pushChoice('ASMを使用せずにデータベースがマウントされる', false);
	sortChoice();
	
	// 287
	q_list.push(new Question('Oracle Restartを使用する目的として正しいものを2つ選択しなさい。',
	'SILVER参考書201Pを参照'));
	pushChoice('障害発生時に別のデータベースへの自動フェイルオーバーを行う', false);
	pushChoice('スタンドアロン環境とOracle Real Application Cluster(RAC)環境における高可用性ソリューションを提供する', false);
	pushChoice('コンポーネントの依存関係に基づく適切な順序での起動と停止を提供する', true);
	pushChoice('データベース、Oracle Netリスナーの自動監視を行う', true);
	sortChoice();
	
	// 288
	q_list.push(new Question('Oracle Restartに関する説明として正しいものを選択しなさい。',
	'SILVER参考書202Pを参照'));
	pushChoice('特定の時点までのロールバックを提供', false);
	pushChoice('チェック操作を定期的に実行してコンポーネント状態を監視', true);
	pushChoice('領域不足時に一時停止し、領域不足が解消すると再開', false);
	pushChoice('災害時に別のサイトにフェイルオーバーを提供する', false);
	sortChoice();
	
	// 289
	q_list.push(new Question('Database Upgrade Assistant(DBUA)を使用したアップグレードに関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書203Pを参照'));
	pushChoice('アップグレード中に追加されたアカウントのロックを自動で解除させることはできない', true);
	pushChoice('リリースアップグレードに使用することができるが、パッチセットアップグレードに使用することはできない', false);
	pushChoice('不要となった初期化パラメータや非推奨の初期化パラメータなどは自動で調整されるため、アップグレード中に制御することはできない', true);
	pushChoice('アップグレード処理が自動化されるため、表領域やREDOログ構成などの修正を行っておくことはできない', false);
	sortChoice();
	
	// 290
	q_list.push(new Question('HP-UX環境で動作しているOracle Database 11.2.0.4のデータベースを、12.1.0.1のOracle Linux環境に移行することになりました。'
	+ '\nアップグレード方法として適切なものを選択しなさい。',
	'SILVER参考書204Pを参照'));
	pushChoice('DBUAを使用して直接アップグレードを行う', false);
	pushChoice('12.1のデータベース作成後、エクスポート／インポートを使用してデータを移行する', true);
	pushChoice('Oracleホームをコピー後、DBUAを使用して直接アップグレードを行う', false);
	pushChoice('RMANを使用してファイルを変換後、DBUAを使用して直接アップグレードを行う', false);
	sortChoice();
	
	// 291
	q_list.push(new Question('ASMを使用したOracle Database 11.2のデータベースを12.1にアップグレードします。'
	+ '\n手順に関する説明として正しいものを2つ選択しなさい。',
	'SILVER参考書204Pを参照'));
	pushChoice('Oracle Database 12cのGrid Infrastructureを新しいOracleホームにインストールし、ASMインスタンスをアップグレードする', true);
	pushChoice('Oracle Database 11.2のASMインスタンスとASMを使用したデータベースインスタンスはオープンしておく', false);
	pushChoice('Grid Infrastructureホームをインストールする前に、Oracle Database 11.2のリスナーを停止しておく', true);
	pushChoice('ASMディスクグループの互換性レベルは、アップグレード前にOracle Database 12.1に変更しておく', false);
	sortChoice();
	
	// 292
	q_list.push(new Question('アップグレードした環境で、パフォーマンスを低下させないことが重要な要件になっています。'
	+ '\n事前のパフォーマンステストに適切なOracle機能を2つ選択しなさい。',
	'SILVER参考書206Pを参照'));
	pushChoice('フラッシュバックデータアーカイブ', false);
	pushChoice('リソースマネージャ', false);
	pushChoice('SQLパフォーマンスアナライザ', true);
	pushChoice('データベースリプレイ', true);
	sortChoice();
	
	// 293
	q_list.push(new Question('Oracle Database Vaultを使用したOracle Database 11.2のデータベースをアップグレードするテストで、olspreupgrade.sqlを実行するように指示されました。'
	+ '\n実行手順として適切なものを選択しなさい。',
	'SILVER参考書207Pを参照'));
	pushChoice('アップグレードする前に、Oracle Database 12cのOracleホームにあるolspreupgrade.sqlを11.2のデータベースで実行する', true);
	pushChoice('アップグレードする前に、Oracle Database 11.2cのOracleホームにあるolspreupgrade.sqlを11.2のデータベースで実行する', false);
	pushChoice('アップグレードする前に、Oracle Database 12cのOracleホームにあるolspreupgrade.sqlを12cのデータベースで実行する', false);
	pushChoice('アップグレードする前に、Oracle Database 11.2のOracleホームにあるolspreupgrade.sqlを12cのデータベースで実行する', false);
	sortChoice();
	
	// 294
	q_list.push(new Question('Oracle Database 11.2のデータベースを12cにアップグレードする必要があります。'
	+ '\n12cソフトウェアはインストールが完了し、Database Upgrade Assistant(DBUA)を使用せずにアップグレードするにあたり、最初に実行することが推奨されている操作を選択しなさい。',
	'SILVER参考書208Pを参照'));
	pushChoice('データベースをRESTRICTEDモードでオープンする', false);
	pushChoice('アップグレード前情報ツール（preupgrade.sql）を実行する', true);
	pushChoice('元のOracleホームからlistener.oraファイルを新しいOracleホームにコピーする', false);
	pushChoice('元のOracleホームから初期化パラメータファイルを新しいOracleホームにコピーする', false);
	sortChoice();
	
	// 295
	q_list.push(new Question('Oracle Database 11.2のデータベースを12cにアップグレードするにあたり、次の処理を実行しました。'
	+ '\n目的として正しいものを3つ選択しなさい。'
	+ '\n'
	+ '\n$ cp /u01/app/oracle/product/12.1.0/dbhome_1/rdbms/admin/emremove.sql'
	+ '\n     /u02/app/oracle/product/11.2.0/dbhome_1/rdbms/admin/emremove.sql'
	+ '\n'
	+ '\n$ emctl stop dbconsole'
	+ '\n'
	+ '\n$ sqlplus / as sysdba'
	+ '\n'
	+ '\nSQL> @/u02/app/oracle/product/12.1.0/dbhome_1/rdbms/admin/emremove.sql'
	+ '\n'
	+ '\nSQL> exec DBMS_STATS.GATHER_DICTIONARY_STATS',
	'SILVER参考書209Pを参照'));
	pushChoice('Oracle Enterprise Manager Database Controlリポジトリはアップグレード中に削除されるが、アップグレード時間を短縮するために事前に削除した', true);
	pushChoice('ディクショナリのオプティマイザ統計を再進化しておくことで内部操作を最適化する', true);
	pushChoice('preupgrade_fixups.sqlでは修正されない処理のため、手動で実行した', true);
	pushChoice('アップグレードエラーを避けるために手動で実行した', false);
	sortChoice();
	
	// 296
	q_list.push(new Question('次のコマンドの結果に関する説明として正しいものを選択しなさい。'
	+ '\n'
	+ '\nSQL> @$ORACLE_HOME/rdbms/admin/utluiobj.sql'
	+ '\n.'
	+ '\n.'
	+ '\nPL/SQLプロシージャが正常に完了しました'
	+ '\n'
	+ '\nSQL> SELECT * FROM REGISTRY$sys_inv_objs;'
	+ '\n'
	+ '\nOWNER     OBJECT_NAME     OBJECT_TYPE'
	+ '\n--------- --------------- ---------------'
	+ '\nSYS       P2              PROCEDURE'
	+ '\n'
	+ '\nSQL> SELECT * FROM REGISTRY$nonsys_inv_objs;'
	+ '\n'
	+ '\nレコードが選択されませんでした。',
	'SILVER参考書210Pを参照'));
	pushChoice('移行できないオブジェクトの存在を確認する', false);
	pushChoice('データベース内の無効なオブジェクトの存在を確認する', true);
	pushChoice('文字コード変換できないオブジェクトの存在を確認する', false);
	pushChoice('アップグレード前に無効化したいオブジェクトを格納する', false);
	sortChoice();
	
	// 297
	q_list.push(new Question('DBUAを使用する前にバックアップを取得することが推奨される理由として正しいものを2つ選択しなさい。',
	'SILVER参考書212Pを参照'));
	pushChoice('手動バックアップであればオンラインバックアップを検討できるが、DBUAからのバックアップはデータベースを停止してのコールドバックアップのため、可用性に問題が発生する', true);
	pushChoice('手動バックアップであればRMANを使用した圧縮やテープへのバックアップもできるが、DBUAからのバックアップはファイルシステムへの非圧縮コピーのため、領域的な問題が発生する', true);
	pushChoice('手動バックアップであれば表領域を読み取り専用表領域のバックアップを除外できるが、DBUAからのバックアップはすべてのファイルをバックアップするため、バックアップ時間の問題が発生する', false);
	sortChoice();
	
	// 298
	q_list.push(new Question('Oracle Database 11.2のデータベースを12cにアップグレードします。'
	+ '\nDBUAを使用せずに、高速にアップグレードする必要があります。'
	+ '\n適切なスクリプトを選択しなさい。',
	'SILVER参考書213Pを参照'));
	pushChoice('catcon.pl', false);
	pushChoice('catuppst.sql', false);
	pushChoice('catupgrd.sql', false);
	pushChoice('catctl.pl', true);
	sortChoice();
	
	// 299
	q_list.push(new Question('DBUAを使用せずに、Oracle Database 12cへのアップグレードを実行しました。'
	+ '\nコンポーネントのアップグレードに問題がなかったかどうかを確認するために使用できるスクリプトを選択しなさい。',
	'SILVER参考書213Pを参照'));
	pushChoice('postupgrd.sql', false);
	pushChoice('utlrp.sql', false);
	pushChoice('utlu121s.sql', true);
	pushChoice('utlu121i.sql', false);
	sortChoice();
	
	// 300
	q_list.push(new Question('GUIモードで実行しているDBUAにおいて設定できるものを選択しなさい。',
	'SILVER参考書214Pを参照'));
	pushChoice('前提条件エラーのうち修正可能なものは、修正スクリプトを生成して適用できる', false);
	pushChoice('アップグレード中の並列度を指定し、パラレルにアップグレードを行うことができる', true);
	pushChoice('アップグレード前後のバックアップを取得することができる', false);
	pushChoice('アップグレードの一部として高速リカバリ領域は移動できないが、データベースファイルの移動を行うことができる', false);
	sortChoice();
	
	// 301
	q_list.push(new Question('DBUAを使用して、Oracle Database 11.2から12cにアップグレードしたデータベースがあります。'
	+ '\nSYSBACKUPやSYSDG特権ユーザーオプションを使用して接続する際、ローカル接続はできますが、Oracle Netを使用したリモート接続ができないという報告がありました。'
	+ '\n解決方法として適切なものを2つ選択しなさい。',
	'SILVER参考書216Pを参照'));
	pushChoice('データベースの再起動が行われるまで反映されていないだけなので、再起動を行う', false);
	pushChoice('パスワードの変更が行われるまで反映されないため、パスワードを変更する', false);
	pushChoice('GRANT文を使用して該当する特権ユーザーをパスワードファイルに登録する', true);
	pushChoice('アップグレード直後は最小限のパスワードファイルのため、該当する特権ユーザーを有効にしたパスワードファイルとして再作成する', true);
	sortChoice();
	
	// 302
	q_list.push(new Question('データベースのアップグレード後の確認方法として適切なものを2つ選択しなさい。',
	'SILVER参考書217Pを参照'));
	pushChoice('DBA_REGISTRYビューでコンポーネントのアップグレード後のステータスを確認する', true);
	pushChoice('utluiobj.sqlスクリプトを使用して、無効なオブジェクトが存在しないことを確認する', true);
	pushChoice('postupgrade_fixups.sqlスクリプトを使用して、アカウントロックされたユーザーを確認する', false);
	sortChoice();
	
	// 303
	q_list.push(new Question('Oracle Grid Infrastructureホームを11.2から12cにアップグレードしました。'
	+ '\nデータベースのパスワードファイルをディスクグループに作成しようとしたところ、次のようなエラーが発生します。'
	+ '\n'
	+ '\n$ orapwd file="+FRA/ORCL/orapworcl" dbuniquename="orcl"'
	+ '\n'
	+ '\nEnter password forSYS:'
	+ '\n'
	+ '\nOPW-00010: パスワード・ファイルが作成できませんでした。'
	+ '\n'
	+ '\n原因として適切なものを選択しなさい。',
	'SILVER参考書219Pを参照'));
	pushChoice('ASMディスクグループのASM互換性が12.1以上である必要がある', true);
	pushChoice('ASMディスクグループのASM互換性がRDBMS互換性より小さい必要がある', false);
	pushChoice('ASMディスクグループのRDBMS互換性属性が12.1以上である必要がある', false);
	pushChoice('ASMディスクグループにパスワードファイルを格納する機能は存在しない', false);
	sortChoice();
	
	// 304
	q_list.push(new Question('Oracle Database 11.2のデータベースを12cにアップグレードしたPRODデータベースがあります。'
	+ '\n同じマシンには、アップグレード前にテスト用に作成した12cのTEST1データベースがあります。'
	+ '\nPRODデータベースのアップグレードにはDBUAを使用し、Oracle Enterprise Manager Expressも構成しました。'
	+ '\n'
	+ '\nSQL> connect system@prod'
	+ '\n'
	+ '\nSQL> SELECT DBMS_XDB_CONFIG.getHTTPPort FROM dual;'
	+ '\n'
	+ '\nGETHTTPPORT'
	+ '\n-----------'
	+ '\n       5500'
	+ '\n'
	+ '\nSQL> connect system@test1'
	+ '\n'
	+ '\nSQL> SELECT DBMS_XDB_CONFIG.getHTTPPort FROM dual;'
	+ '\n'
	+ '\nGETHTTPPORT'
	+ '\n-----------'
	+ '\n       5500'
	+ '\n'
	+ '\nPRODデータベースのDatabase Expressに接続しようとしたところ、エラーになります。'
	+ '\n解決方法として適切なものを選択しなさい。',
	'SILVER参考書220Pを参照'));
	pushChoice('リスナーを再起動する', false);
	pushChoice('HTTPではなくHTTPSに変更する', false);
	pushChoice('いずれかのデータベースでDatabase Expressポートを変更する', true);
	pushChoice('同一マシンに複数のEnterprise Manager Database Expressは構成できないため、いずれかのデータベースのDatabase Expressポートを解除する', false);
	sortChoice();
	
	// 305
	q_list.push(new Question('DBUAを使用せずにデータベースのアップグレード後、次のコマンドを実行するタイミングとして適切なものを選択しなさい。'
	+ '\n'
	+ '\nSQL> @postupgrade_fixups.sql',
	'SILVER参考書221Pを参照'));
	pushChoice('固定オブジェクト統計情報の収集の推奨がアップグレード後2週間以内のため、できるだけ早く実行することが望ましい', true);
	pushChoice('ディクショナリ統計の収集は定期的に行うことが推奨されるため、定期的に実行することが望ましい', false);
	pushChoice('タイムゾーンファイルの更新が含まれるため、アップグレード直前に実行することが望ましい', false);
	sortChoice();
	
	// 306
	q_list.push(new Question('マルチテナントで作成したデータベースに空のPDBを作成し、Oracle Database 11gの非CDBで作成したSHスキーマのエクスポートファイルがあります。'
	+ '\nPDBにSHスキーマをインポートする手順として適切なものを選択しなさい。',
	'SILVER参考書222Pを参照'));
	pushChoice('PDBではトランスポータブル表領域のみサポートされているため、スキーマ単位でのインポートはエラーとなる', false);
	pushChoice('PDBへの接続をOracle Net経由とすることで、非CDB同様にインポートすることができる', true);
	pushChoice('PDBからソースデータベースに接続するデータベースリンクを作成後、インポートすることができる', false);
	pushChoice('PDBに直接インポートすることができないため、CDBにインポートを行い、PDBにデータをコピーする', false);
	sortChoice();
	
	// 307
	q_list.push(new Question('Oracle Database 9.2.0.8のデータベースを12.1にアップグレードする方法として適切なものを2つ選択しなさい。',
	'SILVER参考書223Pを参照'));
	pushChoice('サポートされているバージョンにアップグレードしてから、Oracle Database12.1にアップグレードする', true);
	pushChoice('Oracle Database 9iのデータベースでDBMS_PDB.DESCRIBEを使用して接続するためのXMLファイルを作成後、12.1のCDBに接続する', false);
	pushChoice('直接アップグレードせずに新規データベースを作成後、エクスポート／インポートを使用してデータを移行する', true);
	pushChoice('Oracle Database 9iオプションを指定した12.1のDBUAでアップグレードを行う', false);
	sortChoice();
	
	// 308
	q_list.push(new Question('Oracle Database 11.2のGrid InfrastructureでOracle RestartとASMを使用している環境があります。'
	+ '\nデータベースを12.1にアップグレードするにあたり、12.1のGrid Infrastructureをインストールすることになりました。'
	+ '\n手順として正しいものを2つ選択しなさい。',
	'SILVER参考書224Pを参照'));
	pushChoice('Oracle Database 12.1のGrid Infrastructureを「スタンドアロンサーバー用にOracle Grid Infrastructureをインストールおよび構成」インストールオプションでインストールし、11.2のGrid Infrastructureを後からアンインストールする', false);
	pushChoice('Oracle Database 12.1のGrid Infrastructureを「Oracle Grid InfrastructureまたはOracle 自動ストレージ管理のアップグレード」インストールオプションでアップグレードする', true);
	pushChoice('Oracle Database 12.1のGrid Infrastructureを「Oracle Grid Infrastructureソフトウェアのみをインストール」インストールオプションでインストールし、ASMCAを使用してアップグレードを行う', true);
	pushChoice('Oracle Restartに登録したコンポーネントを削除してから、12.1のGrid Infrastructureを「スタンドアロンサーバー用にOracle Grid Infrastructureをインストールおよび構成」インストールオプションでインストールする', false);
	sortChoice();
	
	// 309
	q_list.push(new Question('Oracle Linuxを使用している環境でOracle Database12.1のGrid Infrastructureにアップグレードを行い、rootupgrade.shを実行しました。'
	+ '\n現在の状態として正しいものを2つ選択しなさい。',
	'SILVER参考書225Pを参照'));
	pushChoice('新しいGrid InfrastructureインストールディレクトリにOracleホームが変更される', true);
	pushChoice('既存のASMディスクグループのASM互換性が新しいバージョンに変更される', false);
	pushChoice('OHASDが新しいOracleホームから起動される', true);
	pushChoice('ASMCAを実行するまでASMインスタンスは古いOracleホームから起動される', false);
	sortChoice();
	
	// 310
	q_list.push(new Question('Recovery Manager以外で、データベースのバックアップファイルを作成できるツールを1つ選択してください。',
	'DataPumpユーティリティのエクスポートを使用して、データベースの論理バックアップを作成することができます。'));
	pushChoice('SQL*Plus', false);
	pushChoice('DataPump', true);
	pushChoice('SQL*Loader', false);
	pushChoice('AWR', false);
	sortChoice();
	
	// 311
	q_list.push(new Question('NOARCHIVELOGモードで運用しているデータベースでリカバリを行います。'
	+ '\nREDOログファイルが損失しており、REDOログを増分バックアップに適用できない場合、RECOVER DATABASEコマンドに指定するオプションを1つ選択してください。',
	'NOARCHIVELOGモードは、アーカイブ・ログ・ファイルが生成されないため、データベースのリカバリーは常に実行できるとは限りません。'
	+ '\nバックアップファイルにログファイルの適用が実行できないケースでも、NOREDOオプションを指定することで、増分バックアップのみを適用することができます。'));
	pushChoice('RESETLOGS', false);
	pushChoice('オプションは要らない', false);
	pushChoice('UNTIL CANCEL', false);
	pushChoice('NOREDO', true);
	sortChoice();
	
	// 312
	q_list.push(new Question('RMANで永続設定が可能な構成を3つ選択してください。',
	'RMANのCONFIGUREコマンドでデバイスの並列度、自動チャネル構成、バックアップピースのサイズ制限などの永続設定を行うことができます。'
	+ '\nブロック変更トラッキングの有効化・無効化はSQLコマンドで設定します。'));
	pushChoice('デバイスの並列度', true);
	pushChoice('自動チャネル構成', true);
	pushChoice('ブロック変更トラッキングの有効化・無効化', false);
	pushChoice('バックアップピースのサイズ制限', true);
	sortChoice();
	
	// 313
	q_list.push(new Question('自動診断リポジトリ（ADR）のADRベースのデフォルト値について、優先順位として正しく並んでいるものはどれですか。1つ選択してください。'
	+ '\n'
	+ '\nA. $ORACLE_HOME/log'
	+ '\nB. ORACLE_BASE環境変数の値'
	+ '\nC. DIAGNOSTIC_DEST初期化パラメータ',
	'自動診断リポジトリ（ADR）内には、アラートログやトレースファイルなどのトラブル時の診断に使用するための情報が保存されます。'
	+ '\nADRベースの場所の優先順位は、DIAGNOSTIC_DEST初期化パラメータ→ORACLE_BASE環境変数の値→$ORACLE_HOME/logの順になります'));
	pushChoice('C → B → A', true);
	pushChoice('B → A → C', false);
	pushChoice(' A → B → C', false);
	pushChoice('C → A → B', false);
	sortChoice();
	
	// 314
	q_list.push(new Question('制御ファイルが全損した場合のリカバリ手順について、空欄に入る正しい組み合わせを1つ選択してください。'
	+ '\n'
	+ '\nデータベースを [ A ] で起動'
	+ '\n[ B ] の指定　'
	+ '\n制御ファイルのリストア'
	+ '\nデータベースの [ C ]'
	+ '\nデータベースのリカバリ'
	+ '\n[ D ] オプションを指定して、データベースをOPEN',
	'制御ファイルが全損した場合のリカバリ手順は以下の通りです。'
	+ '\n'
	+ '\n1.データベースを [NOMOUNT] で起動'
	+ '\n2.[DBID] の指定'
	+ '\n3.制御ファイルのリストア'
	+ '\n4.データベースの [MOUNT]'
	+ '\n5.データベースのリカバリ'
	+ '\n6.[RESETLOGS] オプションを指定して、データベースをOPEN'
	+ '\n'
	+ '\nDBIDの指定は、フラッシュリカバリ領域以外に制御ファイルの自動バックアップを作成している場合、必要になります。'));
	pushChoice('A: MOUNT B: DBID C: MOUNT D: RESETLOGS', false);
	pushChoice('A: MOUNT B: DBID C: MOUNT D: NORED', false);
	pushChoice('A: NOMOUNT B: DBID C: MOUNT D: RESETLOGS', true);
	pushChoice('A: NOMOUNT B: SCN C: MOUNT D: RESETLOGS', false);
	sortChoice();
	
	// 315
	q_list.push(new Question('フラッシュバックドロップを使用して、誤って削除された表を復旧するために必要な前提条件を1つ選択してください。',
	'フラッシュバックドロップ操作でdropした表をリストアすることができます。'
	+ '\nこの機能を使用するためには、ごみ箱を有効化（RECYCLEBINパラメータ=ON(デフォルト)）しておく必要があります。'));
	pushChoice('ARCHIVELOGモードに設定', false);
	pushChoice('自動UNDO管理で運用', false);
	pushChoice('対象の表で、行の移動を有効化', false);
	pushChoice('ごみ箱を有効化', true);
	sortChoice();
	
	// 316
	q_list.push(new Question('フラッシュバック・データベースを使用する場合に行なわなくてはならない手順を3つ選択してください。',
	'フラッシュバック・データベースを実行すると、データベース全体を過去の状態に戻すことが可能です。'
	+ '\n使用するためは、ARCHIVELOGモードの設定、フラッシュリカバリ領域を構成（フラッシュデータベース・ログが保存されます）が必要です。'
	+ '\nDB_FLASHBACK_RETENTION_TARGETパラメータでフラッシュデータベース・ログの保存期間を指定することができます。'));
	pushChoice('ARCHIVELOGモードに設定', true);
	pushChoice('自動UNDO管理で運用', false);
	pushChoice('フラッシュリカバリ領域を構成する', true);
	pushChoice('DB_FLASHBACK_RETENTION_TARGETパラメータを設定', true);
	sortChoice();
	
	// 317
	q_list.push(new Question('データベースの転送を行う際に注意しなければならないことを、2つ選択してください。',
	'データベース転送の前提条件として、ソース・プラットフォームと宛先プラットフォームのエンディアン形式は同じである必要があります。'
	+ '\nデータベースの転送は以前のversionからも使用可能のため、COMPATIBLEが12.0.0.0以上である必要はありません。'
	+ '\nデータベースの転送方法は、データファイルをOSコマンドでコピーする方法と、12c新機能であるRMANを使用する方法がありますが、いずれの場合も、パスワードファイルは手動で作成する必要があります。'));
	pushChoice('COMPATIBLE初期化パラメータが、12.0.0.0以上であること', false);
	pushChoice('パスワードファイル使用時は手動で作成する', true);
	pushChoice('ソース・プラットフォームと宛先プラットフォームのエンディアン形式', true);
	pushChoice(' 同じプラットフォームの場合、データファイルをそのままコピーする', false);
	sortChoice();
	
	// 318
	q_list.push(new Question('Oracle Secure Backupについて、正しく述べているものを2つ選択してください。',
	'Oracle Secure Backupはテープバックアップアップ用のOracleソフトウエアです。'
	+ '\nファイルシステム上にバックアップを取る以外に、テープ媒体にもバックアップを保存することでデータ保護を強化することができます。'
	+ '\nOracle Secure BackupはRMANと統合されています。SBTインタフェースを使用してテープ上にバックアップを作成することができます。'));
	pushChoice('ファイル・システムをテープにバックアップすることによって信頼性の高い安全なデータ保護を提供するメディア・マネージャ', true);
	pushChoice('データベースのバックアップおよびリカバリのアルゴリズムに関する専用の機能も備えている', false);
	pushChoice('ファイル・システムをディスクにバックアップすることによって信頼性の高い安全なデータ保護を提供するメディア・マネージャ', false);
	pushChoice('SBTインタフェースを介してRMANのメディア管理レイヤーとして機能できる', true);
	sortChoice();
	
	// 319
	q_list.push(new Question('Recovery ManagerのBACKUPコマンドで、次のオプションを設定しました。設定される多重化レベルを1つ選択してください。'
	+ '\n'
	+ '\nチャネルに割り当てられた実ファイル数 ： 3'
	+ '\nFILESPERSETパラメータ ： 4'
	+ '\nMAXOPENFILESパラメータ　：5',
	'RMANのバックアップセットは、複数のファイルをまとめて1つのセットとして作成します。'
	+ '\n1つのセットに含めるファイル数を多重化レベルと呼んでいます。'
	+ '\nMAXOPENFILESパラメータは、1つのチャネルでアクセスする最大ファイル数、FILESPERSETパラメータは１つのバックアップセット内に含める最大ファイル数です。'
	+ '\nこの問題では、チャネルに割り当てられた実ファイル数が3つのため、多重化レベルは3になります。'));
	pushChoice('3', true);
	pushChoice('4', false);
	pushChoice('5', false);
	pushChoice('9', false);
	sortChoice();
	
	// 320
	q_list.push(new Question('ALTER SESSION SET CONTAINER文に関しての説明で、正しいものを1つ選択して下さい。',
	'PDBの切り替えが可能なのは共通ユーザのみです。'
	+ '\nSET CONTAINERシステム権限が付与された共通ユーザーは、ALTER SESSION SET CONTAINER文で接続するPDBを切り替えることができます。'));
	pushChoice('システム権限 SET CONTAINERが付与されたローカルユーザのみ使用できる', false);
	pushChoice('システム権限 SET CONTAINERが付与された共通ユーザのみ使用できる', true);
	pushChoice('システム権限 SET CONTAINERが付与されたローカルユーザ、共通ユーザが使用できる', false);
	pushChoice('AFTER LOGONトリガーが実行される', false);
	sortChoice();
	
	// 321
	q_list.push(new Question('マルチコンテナ環境で、CDBだけに存在し、PDBには存在しないものを2つ選択してください。',
	'マルチコンテナ環境では、各PDBに制御ファイルとREDOログファイルが構成はされていません。'
	+ '\nCDB(rootコンテナ)の制御ファイルとREDOログファイルを全てのPDBで使用します。'
	+ '\nアーカイブログファイルは、NOARCHIVELOGモードであれば、CDBにも存在しません。'));
	pushChoice('データファイル', false);
	pushChoice('REDOログファイル', true);
	pushChoice('制御ファイル', true);
	pushChoice('アーカイブ・ログ・ファイル', false);
	sortChoice();
	
	// 322
	q_list.push(new Question('マルチテナント環境のユーザに関する説明として、正しく述べているものを2つ選択してください。',
	'マルチテナント環境のユーザーには、全てのコンテナに存在する共通ユーザーと各コンテナにのみ存在するローカルユーザの2種類があります。'
	+ '\n共通ユーザはルートコンテナでのみ作成可能です。ルートコンテナ内には、ローカルユーザーの作成はできません。'
	+ '\n共通ユーザーの名前は指定された接頭子（デフォルトはC##）にする必要があります。'
	+ '\n各コンテナのローカルユーザーは他のコンテナに同じ名前のユーザーが存在していても別のユーザーです。'));
	pushChoice('ローカルユーザは、すべてのコンテナから作成できる', false);
	pushChoice('同じ名前と資格証明を持つユーザが複数のPDBに存在する場合、各ローカルユーザはそれぞれ、別のユーザである', true);
	pushChoice('共有ユーザの名前は、 C## ではじまる名前にしなければならない', true);
	pushChoice('共通ユーザは、すべてのコンテナから作成できる', false);
	sortChoice();
	
	// 323
	q_list.push(new Question('マルチテナント環境のインスタンスリカバリについて、正しく述べているものを1つ選択してください。',
	'マルチテナント環境では、インスタンスはCDBに紐づいています。'
	+ '\nクラッシュ/インスタンス・リカバリはCDB全体に対してサポートされています。'
	+ '\n特定のPDBのインスタンスリカバリは不可能です。'));
	pushChoice('CDB、PDBともに、インスタンスリカバリがサポートされている', false);
	pushChoice('PDBのみ、インスタンスリカバリがサポートされている', false);
	pushChoice('CDBのみ、インスタンスリカバリがサポートされている', true);
	pushChoice('CDB、PDBともに、インスタンスリカバリはサポートされてない', false);
	sortChoice();
	
	// 324
	q_list.push(new Question('データベースリプレイで取得できないワークロードを3つ選択してください。',
	'データベースリプレイはワークロードを再実行するためのテスト用ツールです。'
	+ '\nたとえば、本番環境で処理中のワークロードを取得し、テスト環境でワークロードを再実行(リプレイ)することができます。'
	+ '\n分散トランザクション、フラッシュバック問い合わせ、SQL以外のオブジェクトへのアクセスはデータベースリプレイでサポートされていない操作です。'));
	pushChoice('分散トランザクション', true);
	pushChoice('フラッシュバック問い合わせ', true);
	pushChoice('専用サーバ接続からのリクエスト', false);
	pushChoice('SQL以外のオブジェクトへのアクセス', true);
	sortChoice();
	
	// 325
	q_list.push(new Question('トランスポータブル表領域を実行するための手順について、空欄に入る正しい組み合わせを1つ選択してください。'
	+ '\n'
	+ '\n1.転送する表領域を [ A ] にする'
	+ '\n2.[ B ] を使用して、メタデータをエクスポートする'
	+ '\n3.データファイルとダンプファイルを、OSコマンドなどで転送する'
	+ '\n4.[ B ] を使用して、メタデータをインポートする'
	+ '\n5.表領域を [ C ] にする',
	'トランスポータブル表領域の機能で表領域を別のOracle Databaseにコピーできます。'
	+ '\nOracle Database12cのトランスポータブル表領域の操作は、OSコマンドを使用してデータファイルをコピーする方法と、12c新機能であるRMANでコピーする方法の2種類があります。'
	+ '\nこの問題では、OSコマンドを使用する以下の手順が問われています。'
	+ '\n'
	+ '\n1.転送する表領域を　読み取り専用にする'
	+ '\n2.DataPumpを使用して、メタデータをエクスポートする'
	+ '\n3.データファイルとダンプファイルを、OSコマンドなどで転送する'
	+ '\n4.DataPumpを使用して、メタデータをインポートする'
	+ '\n5.表領域を 読み書き可能にする'));
	pushChoice('A: オフライン B: DataPump C: オンライン', false);
	pushChoice('A: 読み取り専用 B: DataPump C: 読み書き可能', true);
	pushChoice('A: 読み取り専用 B: SQL*Loader C: 読み書き可能', false);
	pushChoice('A: オフライン B: SQL*Loader C: オンライン', false);
	sortChoice();
	
	// 326
	q_list.push(new Question('"CREATE DATABASE” 文に "ENABLE PLUGGABLE DATABASE" 句を指定することによる結果は、次のどれですか？',
	'CREATE DATABASE ... ENABLE PLUGGABLE DATABASE SQL 文で新規の CDB を作成します。'
	+ '\nENABLE PLUGGABLE DATABASE 句を指定しない場合、新規に作成されたデータベースは非 CDB で、PDB を含めることはできません。'));
	pushChoice('ルートがオープンされ、シードが読取り専用の CDB が作成される。', true);
	pushChoice('ルートがオープンされ、シードがマウントされた CDB が作成される。', false);
	pushChoice('ルートとシードがオープンされ、PDB の 1 つがマウントされた CDB が作成される。', false);
	pushChoice('既存の CDB にプラグしなければならない CDB が作成される。', false);
	pushChoice('ルートのみがオープンされたマルチテナント・コンテナ・データベース (CDB) が作成される。', false);
	sortChoice();
	
	// 327
	q_list.push(new Question('あなたは、SQL* Plus を使用し、SYSDBA 権限でマルチテナント・コンテナ・データベース (CDB) に接続し、以下のシーケンス文を実行しました。'
	+ '\n'
	+ '\nSQL> CREATE PLUGGABLE DATABASE NEW_PDB ADMIN USER PDB_ADMIN IDENTIFIED BY SECRET;'
	+ '\nPluggable database created.'
	+ '\n'
	+ '\nSQL> ALTER PLUGGABLE DATABASE NEW_PDB OPEN;'
	+ '\nPluggable database altered.'
	+ '\nSQL> ALTER SESSION SET CONTAINER = NEN_PDB;'
	+ '\nSession altered.'
	+ '\nSQL> GRANT CONNECT TO PDB_ADMIN;'
	+ '\nGrant succeeded.'
	+ '\nSQL> CONNECT PDB ADMIN/SECRET@LOCALHOST/NEW_PDB'
	+ '\nConnected.'
	+ '\nSQL> SELECT * FROM SESSION PRIVS;'
	+ '\n'
	+ '\nPRIVILEGE'
	+ '\n-------------------------------------------------------'
	+ '\nCREATE SESSION '
	+ '\nSET CONTAINER'
	+ '\n'
	+ '\nSQL> ALTER SESSION SET CONTAINER = PDB$SEED;'
	+ '\n'
	+ '\n最後の SET CONTAINER 文の実行結果はどうなりますか？また、それはなぜですか？',
	''));
	pushChoice('成功する。理由は、PDB_ADMIN ユーザーに必要な権限があるため。', false);
	pushChoice('失敗する。理由は、ローカル・ユーザーは SET CONTAINER 文を使用できないため。', true);
	pushChoice('失敗する。理由は、SET CONTAINER 文にはターゲット・プラガブル・データベース (PDB) として PDB$SEED を使用できないため。', false);
	pushChoice('失敗する。理由は、共通ユーザーは SET CONTAINER 文を使用できないため。', false);
	sortChoice();
	
	// 328
	q_list.push(new Question('あなたは、マルチテラバイトの非 CDB を、プラガブル・データベース (PDB) として既存のマルチテナント・コンテナ・データベース (CDB) にプラグしようとしています。'
	+ '\nこの非 CDB の特徴は次の通りです。'
	+ '\n'
	+ '\n- バージョン：Oracle Database 12c Release 1 64-bit'
	+ '\n- キャラクタ・セット：WE8ISO8859P15'
	+ '\n- 各国キャラクタ・セット：AL16UTF16'
	+ '\n- O/S：Oracle Linux 6 64-bit'
	+ '\n'
	+ '\nこの CDB の特徴は次の通りです。'
	+ '\n'
	+ '\n- バージョン：Oracle Database 12c Release 1 64-bit'
	+ '\n- キャラクタ・セット：AL32UTF8'
	+ '\n- O/S：Oracle Linux 6 64-bit'
	+ '\n'
	+ '\n非 CDB を CDB にプラグする間、ダウンタイムを最小限に抑えるためには、次のどの手法を使用すればいいですか？',
	''));
	pushChoice('トランスポータブル・データベース', false);
	pushChoice('Data Pump のフル・エクスポート/フル・インポート', false);
	pushChoice('DBMS_PDB パッケージ', true);
	pushChoice('トランスポータブル表領域', false);
	pushChoice('RMAN', false);
	sortChoice();
	
	//329
	q_list.push(new Question('プラガブル・データベース (PDB) をオープンする方法として有効なものはどれですか？ 3 つ選択してください。',
	'変更する PDB は、次の方法で指定できます。'
	+ '\n1つ以上のPDBをリストします。'
	+ '\nすべての PDB を変更するには、ALL を指定します。'
	+ '\nリストされた PDB を除くすべての PDB を変更するには、ALL EXCEPT を指定します。'));
	pushChoice('ALTER PLUGGABLE DATABASE PDB OPEN をシードから発行する。', false);
	pushChoice('ALTER DATABASE OPEN を PDB から発行する。', true);
	pushChoice('ALTER DATABASE PDB OPEN をルートから発行する。', false);
	pushChoice('ALTER PLUGGABLE DATABASE OPEN ALL を PDB から発行する。', false);
	pushChoice('ALTER PLUGGABLE DATABASE OPEN ALL をルートから発行する。', true);
	pushChoice('ALTER PLUGGABLE DATABASE PDB OPEN を別の PDB から発行する。', false);
	pushChoice('ALTER PLUGGABLE DATABASE OPEN を PDB から発行する。', true);
	sortChoice();
	
	// 330
	q_list.push(new Question('管理対象のマルチテナント・コンテナ・データベース CDB1 (ARCHIVELOG モードで稼働中) には、HR_PDB とACCOUNTS_PDB という 2 つのプラガブル・データベースが含まれています。'
	+ '\nこのデータベースについては、RMAN を利用したバックアップがあります。'
	+ '\nあなたは、ACCOUNTS_PDB をオープンするコマンドを発行したところ、ACCOUNTS_PDB に属するデフォルトの永続表領域 USERDATA のデータファイル USERDATA.DBF が破損していることを発見しました。'
	+ '\nACCOUNTS_PDB 内のデータファイルをリストアおよびリカバリするためのコマンドを実行する前に、何をすべきですか？',
	'オンラインの表領域をオフライン化すると、一般的な使用を一時的に禁止にできます。'
	+ '\nデータベースの残りの部分はオープンしていて使用可能であり、ユーザーはデータにアクセスできます。'
	+ '\n逆に、オフライン状態の表領域をオンライン化して、データベース・ユーザーがその表領域内のスキーマ・オブジェクトを使用できるようにすることもできます。'
	+ '\n表領域の可用性を変更するには、データベースをオープンする必要があります。'));
	pushChoice('CDB1 をマウント状態にした後、ACCOUNTS_PDB の USERDATA 表領域をオフラインにする。', false);
	pushChoice('ALTER PLUGGABLE DATABASE accounts_pdb RESTRICTED コマンドを発行する。', false);
	pushChoice('ACCOUNTS_PDB の USERDATA 表領域をオフラインにする。', true);
	pushChoice('CDB1 をマウント状態にして、ALTER PLUGGABLE DATABASE accounts_pdb CLOSE IMMEDIATE コマンドを発行する。', false);
	sortChoice();
	
	// 331
	q_list.push(new Question('管理対象のマルチテナント・コンテナ・データベース (CDB) は ARCHIVELOG モードで稼働しています。あなたは、この CBB の RMAN に接続しました。'
	+ '\n以下のコマンドと出力を見てください。'
	+ '\n'
	+ '\nRMAN> SELECT con_id, name, open_mode FROM V$PDBS;'
	+ '\n  CON_ID    NAME      OPEN_MODE'
	+ '\n----------------- ----------------------- ----------------'
	+ '\n  2   PDB$SEED    READ ONLY'
	+ '\n  3   PDB2_1      MOUNTED'
	+ '\n  4   PDB2_2      MOUNTED'
	+ '\n'
	+ '\n次のコマンドを実行しました。'
	+ '\n'
	+ '\nRMAN > BACKUP DATABASE PLUS ARCHIVELOG;'
	+ '\n'
	+ '\nバックアップされるのは、次のどのデータ・ファイルですか？',
	'CDB 全体のバックアップは、非CDB のバックアップと同様です。'
	+ '\nCDB 全体をバックアップすると、RMAN は root、すべての PDB、およびアーカイブ REDO ログをバックアップします。'
	+ '\nその後、CDB のバックアップから、CDB 全体、root のみ、または 1 つ以上の PDB をリカバリすることができます。'));
	pushChoice('ルート・コンテナと PDB$SEED 以外のすべての PDB に属するデータ・ファイル', false);
	pushChoice('ルート・コンテナと PDB$SEED のみに属するデータ・ファイル', false);
	pushChoice('ルート・コンテナとすべてのプラガブル・データベース (PDB) に属するデータ・ファイル', false);
	pushChoice('ルート・コンテナ のみに属するデータ・ファイル', false);
	sortChoice();
	
	// 332
	q_list.push(new Question('2 つのプラガブル・データベース (PDB) を含むマルチテナント・コンテナ・データベース (CDB)で、フラッシュバックが有効になっています。PDB の一方から、あるローカル・ユーザーが誤ってドロップされました。'
	+ '\nあなたは、この PDB を、当該ローカル・ユーザーがドロップされる前の時点までフラッシュバックしたいと考えています。あなたは、CDB に接続し、次のコマンドを実行しました。'
	+ '\n'
	+ '\nSQL > SHUTDOWN IMMEDIATE '
	+ '\nSQL > STARTUP MOUNT '
	+ '\nSQL > FLASHBACK DATABASE to TIME "TO_DATE ("08/20/12" , "MM/DD/YY")"; '
	+ '\n'
	+ '\n以下のコマンドを見てください。'
	+ '\n'
	+ '\n1 ALTER PLUGGABLE DATABASE ALL OPEN;'
	+ '\n2 ALTER DATABASE OPEN;'
	+ '\n3 ALTER DATABASE OPEN RESETLOGS;'
	+ '\n'
	+ '\nフラッシュバックされたスキーマに対する更新を可能にするには、次にどのコマンドを実行すればよいですか？',
	'以下の順に２つのコマンドを実行する必要があります。 コマンドの実行には、SQL PlusやRMANを使用します。'
	+ '\n'
	+ '\nALTER DATABASE OPEN RESETLOGS;'
	+ '\nALTER PLUGGABLE DATABASE ALL OPEN;'));
	pushChoice('2 のみ', false);
	pushChoice('3 のみ', false);
	pushChoice('1 と 2', false);
	pushChoice('3 と 1', true);
	pushChoice('1 のみ', false);
	sortChoice();
	
	// 333
	q_list.push(new Question('管理対象のマルチテナント・コンテナ・データベース (CDB) には、3 つのプラガブル・データベース (PDB) が含まれています。'
	+ '\nあなたは、制御ファイルが破損していることに気づきました。'
	+ '\nそこで、RMAN を使用してこの制御ファイルをリカバリしようと計画しています。'
	+ '\nこれらの PDB に関連付けされた起動トリガーはありません。'
	+ '\n制御ファイルをリカバリし、データベースを完全に動作可能な状態にするには、次のどの 手順を実行すればよいですか？ 3 つ選択してください。',
	'現行のすべての制御ファイルのコピーが消失したか、または破損した場合は、バックアップ制御ファイルをリストアおよびマウントする必要があります。'
	+ '\nリストアされたデータファイルがない場合でも、RECOVER コマンドを実行し、RESETLOGS オプションを指定してデータベースをオープンする必要があります。'
	+ '\n'));
	pushChoice('コンテナ・データベース (CDB) をマウントし、制御ファイル自動バックアップから制御ファイルをリストアする。', false);
	pushChoice('NORMAL モードで CDB をリカバリ、オープンする', false);
	pushChoice('マウントされていない状態でデータベース・インスタンスを起動し、制御ファイル自動バックアップから制御ファイルをリストアする。', true);
	pushChoice('各プラガブル・データベースをリカバリする。', false);
	pushChoice('すべてのプラガブル・データベースをオープンする。', true);
	pushChoice('CDB をマウントした後、RESETLOGS オプションを指定してデータベースをリカバリ、オープンする。', true);
	sortChoice();
	
	// 334
	q_list.push(new Question('管理対象のデータベースでは、TBS PERCENT USED パラメータが 60 に設定され、TBS PERCENT FREE パラメータが 20 に設定されています。'
	+ '\n情報ライフ・サイクル管理 (ILM) を使用してデータ移行を自動化する場合に、自動化される可能性のあるストレージ階層化の操作はどれですか？'
	+ '\n2 つ選択してください。',
	''));
	pushChoice('ターゲット表領域を読取り専用に設定する。', true);
	pushChoice('ソース表領域が TBS PERCENT USED を超えた場合に、別のストレージ階層にあるより低い圧縮率のターゲット表領域に、一部のブロックを移動する。', false);
	pushChoice('ターゲット表領域をオフラインに設定する。', false);
	pushChoice('ソース表領域が TBS PERCENT USED を超えた場合に、別のストレージ階層にあるより高い圧縮率のターゲット表領域に、一部のセグメントを移動する。', true);
	pushChoice('ソース表領域が TBS PERCENT USED を超えた場合に、別のストレージ階層にあるより高い圧縮率のターゲット表領域に、全セグメントを移動する。', false);
	sortChoice();
	
	// 335
	q_list.push(new Question('ストレージ管理者によってプロビジョニングされた新しいストレージ層を活用するため、大きなヒープを必要とする表のパーティションを、Oracle 12c データベース内の他の表領域に移動する必要があります。'
	+ '\nこの表には、ローカル・パーティションとグローバル・パーティションの両方のBツリー索引が定義されています。'
	+ '\nこの表には、日中は大量のトランザクションがアクセスし、夜間と週末にも中規模量のトランザクションがアクセスします。'
	+ '\n可用性の中断を最小限に抑える必要があります。'
	+ '\nこの要件についての正しい説明はどれですか？ 3 つ選択してください。',
	'パーティションの移動を行う際、デフォルトでは索引がUNUSABLEとなり、グローバル索引を手動で再構築する必要がありますが、以下のようにUPDATE INDEXES句を付与することにより、自動的に索引をメンテナンスすることができるようになります。'
	+ '\nALTER TABLE xxxxx MOVE PARTITION UPDATE INDEXES'
	+ '\nよって、トランザクションが発生している場合でも、その動作に影響を与えません。'));
	pushChoice('パーティションは同じ表領域に圧縮できる。', true);
	pushChoice('パーティションを移動した後、グローバル索引を手動で再構築する必要がある。', false);
	pushChoice('パーティションを移動した後、ローカル索引を手動で再構築する必要がある。', false);
	pushChoice('パーティションは新しい表領域にオンラインで移動できる。', true);
	pushChoice('パーティションは新しい表領域に圧縮できる。', true);
	sortChoice();
	
	// 336
	q_list.push(new Question('仮想プライベート・データベース (VPD) ポリシーで表を再定義するための、以下のコマンドを見てください。'
	+ '\n表の再定義について正しく説明しているものはどれですか？'
	+ '\n2 つ選択してください。'
	+ '\n'
	+ '\nBEGIN'
	+ '\n  DBMS_RLS.ADD_POLICY ('
	+ '\n    object_schema   => "hr",'
	+ '\n    object_name   => "employees",'
	+ '\n    policy_name   => "employees_policy",'
	+ '\n    function_schema   => "hr",'
	+ '\n    policy_function   => "auth_emp_dep_100",'
	+ '\n    statement_types => "select, insert, update, delete",'
	+ '\n    );'
	+ '\nEND;'
	+ '\n'
	+ '\nBEGIN'
	+ '\n  DBMS_REDEFINITION.START_REDEF_TABLE ('
	+ '\n    uname   => "hr",'
	+ '\n    orig_table  => "employees",'
	+ '\n    int_table => "int_employees",'
	+ '\n    col_mapping => NULL,'
	+ '\n    options_flag  => DBMS_REDEFINITION.CONS_USE_PK,'
	+ '\n    orderby_cols  => NULL,'
	+ '\n    part_name => NULL,'
	+ '\n    copy_vpd_opt  => DBMS_REDEFINITION.CONS_VPD_AUTO);'
	+ '\nEND;',
	'DBMS_RLS.ADD_POLICY / The DBMS_RLS パッケージには、ファイングレイン・アクセス・コントロールの管理インタフェースが含まれ、これを使用して仮想プライベート・データベース (VPD) を実装します。'
	+ '\nDBMS_RLSは、Enterprise Edition でのみ使用できます。'));
	pushChoice('オンライン再定義中に、元の表から新しい表に VPD ポリシーがコピーされる。', true);
	pushChoice('オンライン再定義中に、元の表から新しい表に VPD ポリシーを手動でコピーする必要がある。', false);
	pushChoice('表内の列名や列の種類は一切変更せずに、表に対するすべてのトリガーが無効になる。', true);
	pushChoice('再定義中に EMPLOYEES 表の主キー制約が無効になる。', false);
	sortChoice();
	
	// 337
	q_list.push(new Question('データベースをリカバリするため、次のコマンドを実行しました。'
	+ '\n'
	+ '\nRMAN> RUN{'
	+ '\n  SET UNTIL TIME "2016-12-20:08:00:00";'
	+ '\n  RESTORE DATABASE;'
	+ '\n  SECOVER DATABASE;'
	+ '\n}'
	+ '\n'
	+ '\nこの状況として正しい記述はどれですか。'
	+ '\n',
	''));
	pushChoice('全データファイルをリストアし、12/20の8時の時点までREDOログを適用する', false);
	pushChoice('12/20の8時より前に作成されたバックアップから全データファイル、REDOログファイルおよび制御ファイルをリストアし、最新の状態までREDOログを適用する', false);
	pushChoice('12/20の8時より前に作成されたバックアップから全データファイルおよび制御ファイルをリストアし、アーカイブログ及びREDOログを12/20の8時の時点まで適用する', true);
	pushChoice('最新のバックアップから制御ファイルおよび全データファイルをリストアしてから、12/20の8時の時点までREDOログを適用する', false);
	sortChoice();
	
	// 338
	q_list.push(new Question('構成にOracle Secure Backupが含まれています。'
	+ '\nテープ上のOracleバックアップピースを管理するには何を使用するのが最適ですか。',
	'RMANを使用せずにOracle Secure Backupユーティリティを使用してテープに格納されているバックアップピースを管理した場合、Oracle Secure BackupカタログとRMANリポジトリが非同期となる場合があります。'
	+ '\nその場合、RMANのCROSSCHECKコマンドでRMANリポジトリを同期します。'));
	pushChoice('Oracle Secure Backup', false);
	pushChoice('RMAN', true);
	pushChoice('SQL', false);
	sortChoice();
	
	// 339
	q_list.push(new Question('次のコマンドを発行しました。'
	+ '\n'
	+ '\nSQL> CREATE TABLE HR.EMP(id NUMBER(4) PRIMARY KEY, name VARCHAR2(10));'
	+ '\nSQL> DROP TABLE HR.EMP;'
	+ '\nSQL> CREATE TABLE HR.EMP(id NUMBER(4) PRIMARY KEY, name VARCHAR2(10) phone VARCHAR2(11));'
	+ '\nSQL> DROP TABLE HR.EMP'
	+ '\nSQL> FLASHBACK TABLE HR.EMP TO BEFORE DROP;'
	+ '\n'
	+ '\n正しい説明を選択してください。',
	'フラッシュバックドロップでリカバリするときは索引も同時にリカバリされる。'
	+ '\n同一名称のオブジェクトをリカバリされるときはLIFOにしたがって対象が選択される。'));
	pushChoice('phone列を含むHR.EMP表がリカバリされる', false);
	pushChoice('phone列を含むHR.EMP表と、その主キーの索引がリカバリされる', true);
	pushChoice('phone列を含まないHR.EMP表がリカバリされる', false);
	pushChoice('phone列を含まないHR.EMP表と、その主キーの索引がリカバリされる', false);
	pushChoice('どちらのEMP表をリカバリするか指定していないのでエラーとなる', false);
	sortChoice();
	
	// 340
	q_list.push(new Question('フラッシュバックデータベースを使用してリカバリできるケースはどれですか。',
	'RESIZEコマンドでファイルサイズを縮小　→　フラッシュバックデータベースではフラッシュバックログを適用することでデータベースを過去の状態に戻すが、ベースとなるデータファイルが正しいサイズで存在していないと、フラッシュバックログに含まれる古いブロックイメージを当てはめることができないため。'
	+ '\n誤って削除した表領域も同様の理由である。'
	+ '\n誤って再作成した制御ファイルを元の古い制御ファイルに戻す　→　フラッシュバックログには制御ファイルの情報は含まれない'
	+ '\nパラメータファイルも同様の理由である。'
	+ '\n'
	+ '\nTO BEFORE RESETLOGSオプションをつけて、RESETLOGS前の状態にフラッシュバックデータベースすることもできる。'));
	pushChoice('誤ってRESIZEコマンドでファイルサイズを縮小したデータファイルを元のサイズに戻す', false);
	pushChoice('誤って削除した表領域をリカバリする', false);
	pushChoice('誤って削除したスキーマをリカバリする', true);
	pushChoice('誤って再作成した制御ファイルを元の古い制御ファイルに戻す', false);
	pushChoice('誤ってパラメータ変更したためパラメータファイルを元の状態に戻す', false);
	sortChoice();
	
	// 341
	q_list.push(new Question('互換性レベル、OS、キャラクタセットが同じプラットフォーム間で、表領域を転送するための手順として正しいものはどれですか。'
	+ '\n'
	+ '\na.ソースデータベースで表領域をREAD ONLYにする。'
	+ '\nb.ソースデータベースからメタデータをエクスポートする。'
	+ '\nc.ターゲットデータベースにメタデータをインポートする。'
	+ '\nd.ダンプファイルをターゲットに転送する。'
	+ '\ne.ダンプファイルとデータファイルをターゲットに転送する。',
	'エクスポート／インポートが必要なのはメタデータのみである。'
	+ '\n異なるプラットフォーム間で転送する場合は、RMANでCONVERTするステップが必要です。'));
	pushChoice('a → b → d → c', false);
	pushChoice('a → b → e → c', true);
	pushChoice('b → e → c', false);
	sortChoice();
	
	// 342
	q_list.push(new Question('以下のコマンドを使って複製を行います。'
	+ '\n正しい説明を2つ選択してください。'
	+ '\n'
	+ '\nDUPLICATE TARGET DATABASE TO orcl2'
	+ '\n  FROM ACTIVE DATABASE'
	+ '\n  USING BACKUPSET;',
	'RMANからターゲットデータベースと補助インスタンスに接続しておく必要がある。'
	+ '\nまた、補助インスタンスからソースデータベースに対して、プルメソッドを用いての複製が行われる。'));
	pushChoice('ターゲットおよび補助インスタンスに接続しておく必要がある', true);
	pushChoice('リカバリカタログに接続しておく必要がある', false);
	pushChoice('プルメソッドが使用される', true);
	pushChoice('プッシュメソッドが使用される', false);
	sortChoice();
	
	// 343
	q_list.push(new Question('バックアップに時間が掛かりすぎていて困っています。'
	+ '\n調べたところ、BACKUP VALIDATEの時間が、バックアップの所要時間に近いことがわかりました。'
	+ '\nこのことから何が言えますか。',
	'BACKUP VALIDATEは読み取りの処理である。'));
	pushChoice('読み取りフェーズがボトルネックとなっている可能性が高い', true);
	pushChoice('書き込みフェースがボトルネックとなっている可能性が高い', false);
	pushChoice('暗号化フェーズがボトルネックとなっている可能性が高い', false);
	pushChoice('BACKUP VALIDATEは破損ブロックの調査をするコマンドなので、バックアップの所要時間とは全く関係ない', false);
	sortChoice();
	
	// 344
	q_list.push(new Question('マルチテナントアーキテクチャについて正しいものはどれですか。'
	+ '\n',
	'REDOログも共通のため、指定したPDBだけに対してログスイッチを行うことはできない。'));
	pushChoice('PDBごとに独自の制御ファイルを持つ', false);
	pushChoice('PDBごとに独自のUNDO表領域を持つ', false);
	pushChoice('PDBごとに独自の一時表領域を設定できる', true);
	pushChoice('指定したPDBだけに対してログスイッチを行うことができる', false);
	sortChoice();
	
	// 345
	q_list.push(new Question('4つのPDBを含むCDBを以下のコマンドで実行しました。'
	+ '\n'
	+ '\nSTARTUP;'
	+ '\n'
	+ '\n起動トリガーなどは作成していません。'
	+ '\nどのような状態となりますか。',
	''));
	pushChoice('すべてのPDBがOPEN状態となる', false);
	pushChoice('CDB$ROOTは読み取り／書き込みモード、それ以外はCLOSEのままとなる', false);
	pushChoice('CDB$ROOTは読み取り／書き込みモード、PDB$SEEDはREAD ONLYモード、PDBはMOUNT状態となる', true);
	pushChoice('すべてのPDBはREAD ONLYモードとなる', false);
	sortChoice();
	
	// 346
	q_list.push(new Question('CDBに複数のPDBが含まれています。'
	+ '\n次のコマンドについて正しい説明はどれですか。'
	+ '\n'
	+ '\nCREATE USER c##a_admin'
	+ '\n  IDENTIFIED BY password'
	+ '\n  DEFAULT TABLESPACE users'
	+ '\n  QUOTA 100M ON users',
	''));
	pushChoice('すべてのPDB上にusers表領域を作成しておく必要がある', true);
	pushChoice('CDB$ROOT上にusers表領域があればよい', false);
	pushChoice('ユーザー名に#を含むのでエラーとなる', false);
	sortChoice();
	
	// 347
	q_list.push(new Question('CDB上にPDB1、PDB2という2つのPDBがあります。'
	+ '\nRMANでターゲットPDB1に接続した状態で次のコマンドを発行しました。'
	+ '\n'
	+ '\nBACKUP DATABASE PLUS ARCHIVELOG;'
	+ '\n'
	+ '\nどのようになりますか。',
	'PLUS ARCHIVELOGや制御ファイルは共通コンポーネントであり、PDBには含まれない。'
	+ '\nそのためバックアップから除外されるが、エラーにはならない。'));
	pushChoice('コマンドはエラーとなる', false);
	pushChoice('コマンドは成功し、PDB1のデータファイルのみがバックアップされる', true);
	pushChoice('コマンドは成功し、PDB1とアーカイブログファイルがバックアップされる', false);
	pushChoice('コマンドは成功し、CDB上のすべてのデータベースとアーカイブログファイルがバックアップされる', false);
	sortChoice();
	
	// 348
	q_list.push(new Question('DDL_LOCK_TIMEOUT初期化パラメータに関する正しい説明はどれですか?',
	'DDL_LOCK_TIMEOUT初期化パラメータは、DDLコマンドがDMLロックの解放を待つ時間を指定します。'
	+ '\nユーザーがDMLを実行している間、DDLコマンドは排他的ロックを取得できないために失敗します。'
	+ '\nDDL_LOCK_TIMEOUT初期化パラメータを使用して、DDLがDMLロックの解放を待つ時間（秒）を指定できます。'
	+ '\nDMLロックが指定された秒数以内に解放されれば、DDLは実行を続けエラーは生成されません。'
	+ '\n'
	+ '\nDDL_LOCK_TIMEOUT初期化パラメータのデフォルト値は90秒である、という回答は間違いです。'
	+ '\nデフォルト値は0ですが、これは、DDLがDMLロックの解放を待つ必要がないことを示しています。'));
	pushChoice('DDLコマンドがDMLロックの解放を待つ時間を指定します。', true);
	pushChoice('DDLコマンドを発行できるユーザーセッションを指定します。', false);
	pushChoice('デフォルト値は90秒です。', false);
	pushChoice('エラーを生成する前に、DDLコマンドが実行を完了する時間を指定します。', false);
	sortChoice();
	
	// 349
	q_list.push(new Question('あなたはORDERSテーブルのオンラインテーブル再定義を実施しています。'
	+ '\n依存オブジェクトに関する正しい説明はどれですか?(2つ選んでください。)',
	'依存オブジェクトで、影響を受けないビュー、シノニム、およびPL/SQLパッケージは有効のままです。'
	+ '\n影響を受けないトリガーは無効にされ、DMLステートメントがテーブルで次回発行されるときに自動的に再び有効にされる、という回答も正解です。'
	+ '\n'
	+ '\n旧リリースでは、オンラインテーブル再定義を実施しているとき、依存オブジェクトはすべて無効にされました。'
	+ '\nOracle Database 11gでは、このようなことはもはやありません。'
	+ '\nビュー、シノニム、およびPL/SQLパッケージはオンライン再定義により影響を受けなければいつまでも有効です。トリガーは常に無効にされますが、DMLステートメントがテーブルで次回実行されるときに、自動的に再び有効にされます。'));
	pushChoice('影響を受けないビュー、シノニム、およびPL/SQLパッケージは無効になります。', false);
	pushChoice('影響を受けないビュー、シノニム、およびPL/SQLパッケージは有効のままです。', true);
	pushChoice('影響を受けないトリガーは有効になったままです。', false);
	pushChoice('影響を受けないトリガーは無効にされ、DMLステートメントがテーブルで次回発行されるときに自動的に再び有効にされます。', true);
	sortChoice();
	
	// 350
	q_list.push(new Question('適応カーソル共有に関する正しい説明はどれですか?',
	'適応カーソル共有により、バインド変数を持つ単一のSQL文が異なる有益な実行計画を使用できるようになります。'
	+ '\nバインド変数を持つSQL文が実行されるとき、オプティマイザはバインド変数の値を調べ、SQL文の以前の実行の情報を使用して、どの実行計画がもっとも有益かを判断します。'
	+ '\n'
	+ '\n適応カーソル共有はデフォルトで無効になっており、初期化パラメータを設定することで有効にする必要がある、という回答は間違いです。'
	+ '\nこれはデフォルトで有効にされており、無効にできません。'
	+ '\n'
	+ '\n適応カーソル共有により、バインド変数を持つ単一のSQL文は同じ実行計画を常に使用しなければならない、という回答は間違いです。'
	+ '\n適応カーソル共有では、複数の実行計画がバインド変数の値と以前の実行の情報に基づいて使用されます。'
	+ '\n'
	+ '\n部のカーソルはバインド認識ですが、適応カーソル共有では、カーソルはすべてバインド認識である、という回答は間違いです。'
	+ '\nオプティマイザが、異なる実行計画の方がバインド変数の値と実行履歴の値によっては有益であると判断するとき、カーソルはバインド認識としてマークされます。'));
	pushChoice('適応カーソル共有により、バインド変数を持つ単一のSQL文が異なる実行計画を使用できるようになります。', true);
	pushChoice('適応カーソル共有により、バインド変数を持つ単一のSQL文は同じ実行計画を常に使用しなければなりません。', false);
	pushChoice('適応カーソル共有では、カーソルはすべてバインド認識です。', false);
	pushChoice('適応カーソル共有はデフォルトで無効になっており、初期化パラメータを設定することで有効にする必要があります。', false);
	sortChoice();
	
	// 351
	q_list.push(new Question('あなたは次のカラムを含むテーブルにAR_TRX_HYと名前を付けました。'
	+ '\n'
	+ '\nAR_TRX_ID'
	+ '\nAR_TRX_DATE'
	+ '\nAR_TRX_CUST_ID'
	+ '\nAR_TRX_AMT'
	+ '\n'
	+ '\n顧客IDと開始日/終了日を受け入れるGET_CUST_TRXという名前のPL/SQLプロシージャを使用しており、指定期間の顧客の売掛金を返します。'
	+ '\nAR_TRX_HYテーブルのオンライン再定義の使用に関する正しい説明はどれですか?',
	'再定義がGET_CUST_TRXプロシージャによって参照されないカラムのみに影響を与える場合、プロシージャは無効にされません。'
	+ '\nOracle 11gでは、再定義によって論理的に影響を受ける依存オブジェクトとトリガーのみが無効にされます。'
	+ '\nGET_CUST_TRXは有効のままで、次に実行されるときに再コンパイルの必要はありません。'
	+ '\n'
	+ '\nオンライン再定義はGET_CUST_TRXプロシージャを無効にする、という回答は間違いです。'
	+ '\n論理的にGET_CUST_TRXプロシージャに影響を与えない場合オンライン再定義が実施され、プロシージャは無効になりません。'
	+ '\n'
	+ '\n再定義により新しいカラムが追加された場合、GET_CUST_TRXプロシージャは無効になります、という回答は間違いです。'
	+ '\n新しいカラムを追加しても、GET_CUST_TRXプロシージャには論理的に影響を与えません。従って、有効のままになっています。'
	+ '\n'
	+ '\n再定義によりAR_TRX_CUST_IDカラムがドロップした場合、GET_CUST_TRXプロシージャは有効のままである、という回答は間違いです。'
	+ '\nこのシナリオのGET_CUST_TRXプロシージャは顧客IDによりAR_TRX_HYを照会します。'
	+ '\n従って、顧客IDカラムをドロップするとGET_CUST_TRXプロシージャに影響がおよび、無効にされます。'));
	pushChoice('再定義により新しいカラムが追加された場合、GET_CUST_TRXプロシージャは無効になります。', false);
	pushChoice('オンライン再定義はGET_CUST_TRXプロシージャを無効にします。', false);
	pushChoice('再定義がGET_CUST_TRXプロシージャによって参照されないカラムのみに影響を与える場合、プロシージャは無効にされません。', true);
	pushChoice('再定義によりAR_TRX_CUST_IDカラムがドロップした場合、GET_CUST_TRXプロシージャは有効のままです。', false);
	sortChoice();
	
	// 352
	q_list.push(new Question('Oracle 11gのテーブルのオンライン再定義に関する正しい説明はどれですか?',
	'順序依存のトリガーを持つテーブルで、オンライン再定義を実施することができます。'
	+ '\n順序依存は、FOLLOWSまたはPRECEDES節を含めることによって、トリガーに対してセットアップされます。'
	+ '\nOracle 11gでは、テーブルにこれらの節の1つを含むトリガーがある場合でも、テーブルのオンラインを再定義をすることができます。'
	+ '\n'
	+ '\nマテリアライズド・ビューを含むテーブルのオンライン再定義を実施するには、まずマテリアライズド・ビューをドロップする必要がある、という回答は間違いです。'
	+ '\n旧リリースでは真でしたが、Oracle 11gではマテリアライズド・ビューとマテリアライズド・ビュー・ログを持つテーブルに対してオンライン再定義を実施することができます。'
	+ '\nただし、これを実行した後、オンライン再定義に続いて完全なリフレッシュを実行する必要があります。'
	+ '\n'
	+ '\nオンライン再定義を実施するとき、依存オブジェクトはすべて無効になる、という回答は間違いです。'
	+ '\n論理的に影響を受けた依存オブジェクトとトリガーのみが無効にされます。'
	+ '\n'
	+ '\n順序依存のトリガーを持つテーブルで、オンライン再定義を実施することはできません、という回答は間違いです。'
	+ '\nOracle 11gでは、FOLLOWSまたはPRECEDES節を含むトリガーで、テーブルのオンライン再定義を実行することができます。'));
	pushChoice('オンライン再定義を実施するとき、依存オブジェクトはすべて無効になります。', false);
	pushChoice('マテリアライズド・ビューを含むテーブルのオンライン再定義を実施するには、まずマテリアライズド・ビューをドロップする必要があります。', false);
	pushChoice('順序依存のトリガーを持つテーブルで、オンライン再定義を実施することができます。', true);
	pushChoice('順序依存のトリガーを持つテーブルで、オンライン再定義を実施することはできません。', false);
	sortChoice();
	
	// 353
	q_list.push(new Question('データベースに複数の一時テーブルスペースがあります。'
	+ '\n各テーブルスペースに対して、割り当てられていないスペースや現在割り当てられているが再利用可能なスペースを含め、どれだけのスペースが空いているかを判断する必要があります。'
	+ '\nこれを素早く完了するために使用すべきSQLはどれですか?',
	'Oracle 11gでは、DBA_TEMP_FREE_SPACEビューが使用可能で一時テーブルスペースの領域使用量に関する情報を提供します。'
	+ '\nFREE_SPACEカラムは、各テーブルスペースで使用可能な合計の空き容量が表示されます。'
	+ '\n使用可能な合計空き容量はバイトで表示されます。'
	+ '\nこれには、割り当てられていない領域と割り当てられているが再利用可能なすべての領域が含まれます。'
	+ '\n'
	+ '\nALLOCATED_SPACEカラムは使用することはできません。このカラムは合計の空き容量ではなく、割り当てられた領域の合計量を表示します。'
	+ '\n割り当てられた領域には、使用されているものおよび使用されていないが再利用可能なものを含め、現在割り当てられているすべての領域が含まれます。'
	+ '\n'
	+ '\nDBA_FREE_SPACEビューは一時テーブルスペースの情報を表示しないため、DBA_FREE_SPACEビューは使用することはできません。'
	+ '\n'
	+ '\nDBA_TEMP_FILESビューは使用することはできません。'
	+ '\nこれによって必要な情報は与えられますが、一時テーブルスペースのすべての一時ファイルを1つずつ一覧表示します。'
	+ '\n目的の情報を取得するには、この情報を手動で合計する必要があります。'));
	pushChoice('SELECT TABLESPACE_NAME, FILE_NAME, BYTES FROM DBA_TEMP_FILES;', false);
	pushChoice('SELECT TABLESPACE_NAME, FREE_SPACE FROM DBA_TEMP_FREE_SPACE;', true);
	pushChoice('SELECT TABLESPACE_NAME, FILE_ID, BYTES, BLOCKS FROM DBA_FREE_SPACE;', false);
	pushChoice('SELECT TABLESPACE_NAME, ALLOCATED_SPACE FROM DBA_TEMP_FREE_SPACE;', false);
	sortChoice();
	
	// 354
	q_list.push(new Question('PL/SQL結果キャッシュに関する正しい説明はどれですか?(3つ選んでください。)',
	'RESULT_CACHE節を使用してファンクションを宣言すると、ファンクションの結果キャッシュを有効にできます。'
	+ '\nファンクションが初めてコールされるとき実行され、ファンクションにより返された結果はSGAの共有プールにキャッシュされすべてのセッションで使用できます。'
	+ '\nファンクションが同じパラメータで次にコールされると、値はファンクションを再実行せずに結果キャッシュから検索されます。'
	+ '\nファンクションの結果がテーブルまたはビューに依存する場合、オプションのRELIES_ON節を含めることができます。'
	+ '\nこのとき、ALTER TABLEまたはALTER VIEWステートメントを使用してこれらのオブジェクトのどれかの構造を変更すると、結果キャッシュは無効になり、ユーザーが次に呼び出すときにファンクションは実行されます。'
	+ '\n'
	+ '\n結果キャッシュはSGAに保存されすべてのセッションで利用できるため、結果キャッシュはセッション固有である、という回答は間違いです。'
	+ '\n'
	+ '\n結果キャッシュは、キャッシュから削除するまでいつまでも残る、という回答は間違いです。'
	+ '\nシステムが追加メモリを必要とするとき結果キャッシュは古くなり、もっとも古い結果キャッシュが削除されます。'
	+ '\n'
	+ '\nIN、OUT、およびIN OUTパラメータを含むPL/SQLファンクションに対して結果キャッシュを使用できる、という回答は間違いです。'
	+ '\nファンクションがOUTまたはIN OUTパラメータで宣言される場合PL/SQLファンクション結果キャッシュは使用できず、RETURNを使用して結果を返す必要があります。'));
	pushChoice('結果キャッシュは、キャッシュから削除するまでいつまでも残ります。', false);
	pushChoice('同じパラメータ値を持つファンクションは、データベースインスタンスで初めてコールされるときに実行されます。', true);
	pushChoice('ファンクションの結果キャッシュは、セッション固有です。', false);
	pushChoice('CREATE FUNCTIONステートメントにRELIES_ON節を含める場合、依存するデータベースオブジェクトの構造が変わると、すべての結果キャッシュは無効になります。', true);
	pushChoice('ファンクションの結果キャッシュは、すべてのデータベースセッションに適用できます。', true);
	pushChoice('IN、OUT、およびIN OUTパラメータを含むPL/SQLファンクションに対して結果キャッシュを使用できます。', false);
	sortChoice();
	
	// 355
	q_list.push(new Question('次のデータベースのシナリオを見てください。'
	+ '\n'
	+ '\n-RMAN でバックアップの最適化が有効に設定されている。'
	+ '\n-RMAN でリカバリ期間が7日間に設定されている。'
	+ '\n-TOOLS 表領域の最新のディスク・バックアップは、2007 年 11 月 3 日に実行された。'
	+ '\n-2007 年 11 月 4 日以降、TOOLS 表領域は読取り専用である。'
	+ '\nあなたは、2007 年 11 月 23 日に RMAN コマンドを発行して、データベースをディスクにバックアップしました。'
	+ '\n'
	+ '\nTOOLS 表領域のバックアップに関する正しい説明は、次のどれですか？',
	'テープからのバックアップでは、最新のバックアップが指定リカバリ期間よりも古い場合には、同一ファイルのバックアップが存在する場合でも、ファイルの RMAN バックアップが実行されます。'
	+ '\nこれは、有効期限後にメディアを再利用できるようにするためです。'
	+ '\n'
	+ '\nディスクからのバックアップでは、ディスク上のバックアップに同一ファイルが存在する場合は、そのバックアップがリカバリ期限の開始時点より古い場合でも、RMAN バックアップは省略されます。'
	+ '\n保存方針により、RMAN は必要な限り古いバックアップを保持します。'));
	pushChoice('ディスク・バックアップでのみ最適化を有効に設定できるため、RMAN はバックアップを実行する。', false);
	pushChoice('バックアップの最適化が有効に設定されているため、RMAN は表領域のバックアップを省略する。', false);
	pushChoice('TOOLS 表領域は読取り専用のため、RMAN バックアップは失敗する。', false);
	pushChoice('7日間のリカバリ期間内に表領域のバックアップが存在しないため、RMAN はバックアップを実行する。', true);
	sortChoice();
	
	// 356
	q_list.push(new Question('ARCHIVELOG モードのデータベースの領域使用量を監視中に、あなたはフラッシュ・リカバリ領域の空き領域が不足していて、これ以上ファイルを格納できないことに気付きましたが、あなたには領域を追加する権限がありません。'
	+ '\nログ・スイッチが発生した場合に起こることは、次のどれですか？ （2 つ選択して下さい）',
	'ログ・スイッチは、データベースが、オンラインREDO ログ・ファイルへの書込みを終了して他のファイルへの書込みを開始するときに発生します。'
	+ '\n通常は、現行のオンライン REDO ログ・ファイルが完全にいっぱいになり、引き続き書込みが必要な場合にログ・スイッチが発生します。'
	+ '\nただし、ログ・スイッチは、現行のオンライン REDO ログ・ファイルが完全にいっぱいになっているかどうかに関係なく、定期的に発生するように設定できます。'
	+ '\nログ・スイッチは、手動で強制的に発生させることもできます。'
	+ '\n'
	+ '\n増分チェックポイントはスレッドのチェックポイントの一種であり、オンライン REDO ログを切り替えるとき、大量のブロックの書込みを防止することが目的の1つとなっています。'
	+ '\nDBWn は、実行する処理の有無を少なくとも 3 秒ごとにチェックします。'
	+ '\nDBWn が使用済バッファを書き込むと、チェックポイント位置が前進し、これにより、CKPT では、このチェックポイント位置をデータファイル・ヘッダーではなく制御ファイルに書き込みます。'));
	pushChoice('フラッシュ・リカバリ領域に空き領域が作成されるまで、トランザクションログのログ・スイッチは停止する。', true);
	pushChoice('データベース・インスタンスの状態は暗黙的に RESTRICTED モードに変更され、フラッシュ・リカバリ領域にファイルを作成できなくなる。', false);
	pushChoice('アラート・ログ・ファイルにエントリが生成され、データベース・インスタンスは正常に機能する。', false);
	pushChoice('Oracle データベースサーバーは不要ファイルリスト上のファイルを削除して、フラッシュ・リカバリ領域に空き領域を作成する。', true);
	sortChoice();
	
	// 357
	q_list.push(new Question('SQL アクセス・アドバイザの推奨事項の実装に関する正しい説明は、次のどれですか？',
	'SQL アクセス・アドバイザは、システムのパフォーマンスを向上する索引の追加やマテリアライズド・ビューに関する推奨事項を提供するために、Oracle 10g で導入されました。'
	+ '\nOracle 11g では、SQL アクセス・アドバイザに 2 つの大幅な変更が加えられました。'
	+ '\n'
	+ '\n1 アドバイザにパフォーマンス向上の可能性のあるパーティションスキームのアドバイスが含まれていること'
	+ '\n2 従来のワークロード操作が廃止され、SQL チューニング・セットが代わりに使用されるようになったこと'));
	pushChoice('特定のタスクに対する SQL アクセス・アドバイザの推奨事項は、すべて同時に実装する必要がある。', false);
	pushChoice('SQL アクセス・アドバイザの推奨事項の実装は、メンテナンス･ウィンドウの実行中に自動的にスケジュール化される。', false);
	pushChoice('SQL アクセス・アドバイザの推奨事項は、個別に実装をスケジュール化できる。', true);
	pushChoice('SQL アクセス・アドバイザの推奨事項は自動的に実装される。', false);
	sortChoice();
	
	// 358
	q_list.push(new Question('データベースは ARCHIVELOG モードで稼動しています。'
	+ '\nデータベースには 3 つの REDO ログ・グループがあり、各ログ・グループに 1 つのメンバーが存在します。'
	+ '\nREDO ログ・グループのひとつが破損したため、 その破損した REDO ログファイルのリカバリを行い、以下のコマンドを発行しました。'
	+ '\n'
	+ '\nALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;'
	+ '\n'
	+ '\nこのコマンドを使用した直後に、次のどれを実行すればよいですか？',
	'削除されたログ・グループに依存せずに、完全リカバリで使用できるバックアップを作成するため、オペレーティング・システムのユーティリティを使用してデータベース内のすべてのデータファイルを即時にバックアップします。'
	+ '\n'
	+ '\n入力例：% cp /disk1/oracle/dbs/*.dbf /disk2/backup'
	+ '\n'
	+ '\nこの文は、破損した REDO ログを削除して、アーカイブ化を回避します。'
	+ '\n削除された REDO ログは、アーカイブされなくても使用できます。'
	+ '\nバックアップのリカバリに必要なログファイルを削除した場合、そのバックアップを使用してリカバリを実行することができなくなります。'
	+ '\nデータベースはアラート・ログにリカバリに使用できないバックアップを記したメッセージを書き込みます。'));
	pushChoice('データベース・インスタンスを停止して、データベースの完全リカバリを実行する。', false);
	pushChoice('データベースを NONARCHIVELOG モードに切り替える。', false);
	pushChoice('ログ・スイッチを実行する。', false);
	pushChoice('データベースのバックアップを実行する。', true);
	sortChoice();
	
	// 359
	q_list.push(new Question('あなたは、制御ファイルを使用して、Recovery Manager (RMAN) を使用したデータベースのバックアップに関する情報を管理しています。'
	+ '\nリカバリ・カタログが必要となるシナリオは、次のどれですか？ （2 つ選択して下さい）',
	'リカバリ・カタログの使用は、ほぼ任意であることを理解しましょう。'
	+ '\nリカバリ・カタログは、スクリプトの保存や、バックアップ記録を1年以上または CONTROL_FILE_RECORD_KEEP_TIME の設定以上の期間まで保存する場合に必要となります。'
	+ '\n'
	+ '\nリカバリ・カタログを使用すると、以下の RMAN コマンドを使用できます。'
	+ '\n- BACKUP...KEEP UNTIL TIME 保存方針の設定とは異なる保存期間で、バックアップを保存します。'
	+ '\n- BACKUP...KEEP FOREVER バックアップを永久的または手動で削除するまで保存します。'
	+ '\n- REPORT SCHEMA...AT 過去の特定の時点でのデータベース構造を表示します。'));
	pushChoice('CONTROL_FILE_RECORD_KEEP_TIME パラメータを使用して、バックアップを特定の期間保持する場合', false);
	pushChoice('REPORT SCHEMA コマンドの AT オプションを使用して、特定の時刻にターゲット・データベースにあったデータファイルを一覧表示する場合', true);
	pushChoice('複数のデータベースのバックアップ情報を保存する場合', true);
	pushChoice('バックアップに使用される領域を制限する場合', false);
	sortChoice();
	
	// 360
	q_list.push(new Question('あなたは、リカバリ・カタログと Recovery Manager (RMAN) を使用して本番データベースのバックアップを実行しています。'
	+ '\nバックアップとアーカイブ REDO ログ・ファイルは、毎日テープドライブにコピーされています。'
	+ '\nメディア障害のため、リカバリ・カタログ・データベースと本番データベースを完全に消失しました。'
	+ '\nあなたは、ターゲット・データベースのリカバリを実行して、機能させたいと考えました。'
	+ '\nこのタスクの実行にあたり、以下の手順を考えています。'
	+ '\n'
	+ '\n1.サーバー・パラメータ・ファイルの自動バックアップをリストアする。'
	+ '\n2.制御ファイルをリストアする。'
	+ '\n3.ターゲット・データベース・インスタンスを起動する。'
	+ '\n4.データベースをマウントする。'
	+ '\n5.データファイルをリストアする。'
	+ '\n6.RESETLOGS オプションでデータベースをオープンする。'
	+ '\n7.データファイルのリカバリを実行する。'
	+ '\n8.ターゲット・データベースのDBID を設定する。'
	+ '\n'
	+ '\n上記手順の正しい順序を表しているのは、次のどれですか？',
	'リカバリカタログがない場合には、SPFILE の自動バックアップを検索するために DBID を指定する必要があります。'));
	pushChoice('1、8、 3、 4、 2、 5、 7、 6', false);
	pushChoice('8、1、 3、 2、 4、 5、 7、 6', true);
	pushChoice('1、3、 4、 2、 8、 5、 6、 7', false);
	pushChoice('1、3、 2、 4、 6、 5、 7、 8', false);
	sortChoice();
	
	// 361
	q_list.push(new Question('下記の RMAN コマンドを見てください。'
	+ '\n'
	+ '\nRMAN> CONFIGURE ENCRYPTION FOR DATABASE ON;'
	+ '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG;'
	+ '\n'
	+ '\nバックアップを実行するための前提条件は、次のどれですか？',
	'すべての RMAN バックアップを暗号化するための環境設定：'
	+ '\nOracle Advanced Security 管理者ガイドの説明に従って Oracle ウォレットを設定します。'
	+ '\n次の RMAN コマンドを発行します。'
	+ '\n'
	+ '\nCONFIGURE ENCRYPTION FOR DATABASE ON;'
	+ '\n'
	+ '\nこの段階で、このデータベースにより作成された RMAN バックアップ・セットはすべてデフォルトで透過的な暗号化を使用します。'));
	pushChoice('デフォルトの暗号化メソッドのため、設定は不要である。', false);
	pushChoice('暗号化を実行するために Oracle ウォレットを設定する。', true);
	pushChoice('暗号化のパスワードを提供する。', false);
	pushChoice('暗号化を実行するために、Oracle ウォレットおよびパスワードを設定する必要がある。', false);
	sortChoice();
	
	// 362
	q_list.push(new Question('EMP 表で、特定の社員 ID の入力データに不整合があります。'
	+ '\nあなたは、２つの SCN の間に存在するすべての行バージョンを取得するために、図の通りに問合せを実行しました。'
	+ '\n図の問合せの結果についての正しい説明は、次のどれですか？ （2 つ選択して下さい）'
	+ '\n'
	+ '\nSELECT    versions_jcid AS VXID.'
	+ '\nversions_startscn AS, '
	+ '\nversions_endscn AS LAST_SCN, '
	+ '\nversions_operation AS OPERATION, ename'
	+ '\nFROM emp'
	+ '\nVERSIONS BETWEEN SCH MINVALUE AND MAXVALUE '
	+ '\nAS OF SCH 6636300 '
	+ '\nWHERE empno=7126;'
	+ '\nVXID                FIRST_SCN     LAST_SCN    O    ENAME'
	+ '\n----------------  -----------   ----------    --  ------'
	+ '\n8C0031003A000000    6636289                   I    Smith'
	+ '\n8C0030003A000000    6636280                   D    Jones'
	+ '\n8C0028O03A000000    6636252      6636280      I    Jones',
	'VERSIONS_OPERATION 列を見ると、2つ目のレコードは、最後の行の DELETE 操作であることがわかります（"D" で指定）'
	+ '\nメタデータも、このデータの最終バージョンは、DELETE 操作であることを示唆しています。'
	+ '\nバージョンの終了タイムスタンプは NULL であることから、以前のレコードは存在しないことがわかります。'
	+ '\n行が削除され、再び挿入された場合でも、行への変更が表示されていることに注意してください。VERSION_OPERATION 列は、行に対して実行された操作（INSERT/UPDATE/DELETE）を表示します。'
	+ '\nこれは、履歴表や追加の列の必要なく実行されます。'));
	pushChoice('3番目の行の LAST_SCN 値は 6636280 であることから、行バージョンはSCN 6636280 に存在している。', false);
	pushChoice('最初の行の LAST_SCN 値は NULL であることから、行バージョンは SCN 6636300 に存在している。', true);
	pushChoice('2 番目の行の LAST_SCN 値は NULL であることから、行バージョンはすでに削除されており、存在しない。', true);
	pushChoice('2 番目の行の LAST_SCN 値は NULL であることから、行バージョンは SCN 6636300 に存在している。', false);
	sortChoice();
	
	// 363
	q_list.push(new Question('RMANのCONFIGURE CHANNEL コマンドまたは ALLOCATE CHANNEL コマンドを使用して指定できるチャネル設定を選んでください。(当てはまるものすべてを選択)',
	'チャネルを手動で割り当てる場合も自動で割り当てる場合も、チャネル制御コマンドおよびオプションを使用して、次の操作を実行できます。'
	+ '\n'
	+ '\nRMAN操作の実行時にRMAN が使用するオペレーティング・システム・リソースの制御。'
	+ '\nバックアップ又はリストアの並列度の設定（BACKUP コマンドの FILESPERSET パラメータを使用）'
	+ '\nキロバイト、メガバイト、ギガバイト単位でのI/O 帯域幅消費制限の設定（ALLOCATE CHANNEL ...RATEおよび CONFIGURE CHANNEL ... RATE）。'
	+ '\nバックアップ・ピースのサイズ制限の設定（CONFIGURE CHANNEL および ALLOCATE CHANNEL コマンドで指定する MAXPIECESIZE パラメータ）- 「バックアップ・セットとバックアップ・ピースのサイズを指定する」という選択肢は半分正解'
	+ '\nバックアップ・セットのサイズ制限の設定（BACKUP および CONFIGURE コマンドで指定する MAXSETSIZE パラメータ）'));
	pushChoice('メディア・マネージャにベンダー特有の情報を指定する。', true);
	pushChoice('入力/出力（I/O）帯域幅の使用量を制限する。', true);
	pushChoice('バックアップおよびリストア操作の並列度を指定する。', false);
	pushChoice('バックアップ・セットとバックアップ・ピースのサイズを指定する。', false);
	sortChoice();
	
	// 364
	q_list.push(new Question('あなたは、以下のRMAN コマンドによりバックアップ操作を実行しました。'
	+ '\n'
	+ '\nRMAN> RUN {'
	+ '\nALLOCATE CHANNEL c1 DEVICE TYPE disk MAXOPENFILES 8;'
	+ '\nBACKUP DATABASE FILESPERSET 4;'
	+ '\n}'
	+ '\n'
	+ '\n上記のバックアッププロセスの多重化レベルは、次のどれですか？',
	'Recovery Manager が同時に読み取ることができるデータファイルの数は、ALLOCATE CHANNEL または CONFIGURE CHANNEL の MAXOPENFILES パラメータによって定義されます。'
	+ '\n基本的な多重化アルゴリズムは、次の通りです。'
	+ '\n'
	+ '\n-各バックアップ・セット内のファイルの数'
	+ '\nこの数は、FILESPERSET 設定および各チャネルによって読み込まれるファイル数の最小値です。'
	+ '\nFILESPERSET のデフォルトは 64 です。'
	+ '\n'
	+ '\n-多重化レベル'
	+ '\nこれは、同時に読み取られ、同じバックアップ・ピースに書き込まれる入力ファイルの数です。'
	+ '\n多重化のレベルは、MAXOPENFILES および各バックアップ・セット内のファイル数の最小値です。'
	+ '\nMAXOPENFILES のデフォルトは 8 です。'
	+ '\nFILEPERSET が 4 に設定されており、12 のデータファイルを 1 つのチャネルでバックアップしたとします。'
	+ '\n多重化レベルはこの数字と 8 の小さい方となるため、チャネルは、各バックアップ・ピースに4 つのデータファイルのブロックを同時に書き込みます。'
	+ '\n'
	+ '\n次に、1 つのチャネルで 50 のデータファイルをバックアップするとします。'
	+ '\n各バックアップ・セット内のファイルの数は 50 です。'
	+ '\n多重化のレベルは、この数と 8 の小さいほうです。'
	+ '\nしたがって、ブロックは、チャネルによって 8 つのデータファイルから各バックアップ・ピースに同時に書き込まれます。'
	+ '\n'
	+ '\n例えば・・・この場合で、実ファイルが３つしかなければ、多重化レベルは３になる。'));
	pushChoice('7', false);
	pushChoice('4', true);
	pushChoice('0', false);
	pushChoice('8', false);
	sortChoice();
	
	// 365
	q_list.push(new Question('フラッシュバック データ アーカイブを設定する際の前提条件は、次のどれですか？ （2 つ選択して下さい）',
	'Flashback Data Archive（フラッシュバック・データ・アーカイブ）の前提条件'
	+ '\n'
	+ '\n1 フラッシュバック・データ・アーカイブの表領域は、自動セグメント領域管理（ASSM）で管理されること'
	+ '\n2 自動UNDO管理を有効に設定すること'
	+ '\n'
	+ '\nフラッシュバック・アーカイブには、多数の制限事項があります。'
	+ '\n'
	+ '\nフラッシュバック アーカイブに使用する表領域には、ローカル・エクステント管理および自動セグメント領域管理を使用すること'
	+ '\nデータベースに自動UNDO管理を使用すること'));
	pushChoice('フラッシュバック データ アーカイブが作成される表領域で自動セグメント領域管理（ASSM）を使用する必要がある。', true);
	pushChoice('データベースが ARCHIVELOG モードで稼動している必要がある。', false);
	pushChoice('フラッシュ・リカバリ領域を定義する必要がある。', false);
	pushChoice('UNDO 保存の保証を有効に設定する必要がある。', false);
	pushChoice('自動 UNDO 管理を有効に設定する必要がある。', true);
	sortChoice();
	
	// 366
	q_list.push(new Question('マテリアライズド・ビューが汎用的なクエリー・リライト機能を利用できるように、マテリアライズド・ビューの最適化を推奨するチューニング・ツールは、次のどれですか？',
	'SQL アクセス・アドバイザは、マテリアライズド・ビューが汎用的なクエリー・リライト機能を利用できるように、マテリアライズド・ビューの最適化を推奨します。'
	+ '\n複雑でデータ量の多い問合せのパフォーマンスを最適化するには、マテリアライズド・ビューと索引を使用する必要があります。'
	+ '\nSQL アクセス・アドバイザは、特定のワークロードに関する適切なマテリアライズド・ビュー、マテリアライズド・ビュー・ログ、索引について推奨し、パフォーマンス目標を到達するのに役立ちます。'
	+ '\nSQL アクセス・アドバイザは、現行のSQL、既存の SQL チューニング・セット（STS）、あるいは仮想ワークロードを使用して推奨事項を作成できます。'));
	pushChoice('セグメント・アドバイザ', false);
	pushChoice('SQL アクセス・アドバイザ', true);
	pushChoice('Undo アドバイザ', false);
	pushChoice('SQL チューニング・アドバイザ', false);
	sortChoice();
	
	// 367
	q_list.push(new Question('データベース・インスタンスの BACKUP_TAPE_IO_SLAVES パラメータは FALSE に設定されています。'
	+ '\nRMAN セッションでテープ・バックアップを実行する場合の正しい説明は、次のどれですか？',
	'RMAN は、I/O スレーブが使用されているかどうかに応じて、SGA または PGA にテープ・バッファを割り当てます。'
	+ '\n初期化パラメータBACKUP_TAPE_IO_SLAVES = true　を設定した場合、RMAN は SGA、あるいは LARGE_POOL_SIZE 初期化パラメータが設定されている場合は、ラージ・プールからテープ・バッファが割り当てられます。'
	+ '\nパラメータを false に設定した場合、RMAN は PGA からバッファを割り当てます。'));
	pushChoice('テープ・バッファはシステム・グローバル領域（SGA）から割り当てられる。', false);
	pushChoice('Oracle のI/Oは、割り込み機構を使用して、各 I/O の終了時を判断する。', false);
	pushChoice('テープ・バッファはプログラム・グローバル領域（PGA）から割り当てられる。', false);
	pushChoice('テープへのI/Oは非同期である。', false);
	sortChoice();
	
	// 368
	q_list.push(new Question('以下の RMAN スクリプトを見てください。'
	+ '\n'
	+ '\nRMAN> run {'
	+ '\ndebug on;'
	+ '\nallocate channel c1 type disk;'
	+ '\nbackup datafile 5;'
	+ '\n}'
	+ '\n'
	+ '\nスクリプトの目的に関する正しい説明は、次のどれですか？',
	'RMAN のデバッグ出力は非常に詳細なため、重要な情報を見分けるのが難しいかもしれません。'));
	pushChoice('データファイル 5 のバックアップを実行し、バックアップ実行中の対和式メッセージを抑える。', false);
	pushChoice('データファイルの既存のバックアップを確認し、最新のバックアップ以降にデータファイルに変更があれば、バックアップを行う。', false);
	pushChoice('データファイルに物理的な破損がないかを調べ、正常であればバックアップする。', false);
	pushChoice('データファイル 5 のバックアップを実行し、RMAN のコンパイル操作中に実行されるすべての SQL 文とその結果を表示する。', false);
	sortChoice();
	
	// 369
	q_list.push(new Question('損失した REDO ログ・グループのリカバリに関する正しい説明は、次のどれですか？',
	'損失した REDO ログ・グループが CURRENT の場合、リストアと取消しベースの不完全リカバリを実行し、RESETLOGS オプションを使用してデータベースをオープンする必要があります。'
	+ '\nCURRENT ステータスの REDO ログ・グループは、ログ・ライター（LGWR）による書き込みが現在実行されていることを示しています。'
	+ '\nこの障害を回復するには、まず完全バックアップからデータベースをリストアして、取消しベースの不完全リカバリを実行する必要があります。'
	+ '\n次に、RESETLOGS オプションを使用してデータベースをオープンします。'
	+ '\n'
	+ '\n「損失した REDO ログ・グループが ACTIVE の場合、リストアと取消しベースの不完全リカバリを実行し、RESETLOGS オプションを使用してデータベースをオープンする必要がある。」'
	+ '\n- この操作は、ログファイルが CURRENT ステータスで、LGWRによる書き込みが現在実行されていることを示している場合のみ必要です。'
	+ '\nチェックポイントを実施して、成功すればログファイルのクリア。失敗したらCURRENTと同様の対応が必要。'));
	pushChoice('損失した REDO ログ・グループが ACTIVE の場合、リストアと取消ベースの不完全リカバリを実行し、RESETLOGS オプションを使用してデータベースをオープンする必要がある。', false);
	pushChoice('損失した REDO ログ・グループが ACTIVE の場合、まずログファイルの消去を試みる必要がある。', false);
	pushChoice('損失した REDO ログ・グループが CURRENT の場合、ログファイルを消去する必要がある。', false);
	pushChoice('損失した REDO ログ・グループが CURRENT の場合、リストアと取消しベースの不完全リカバリを実行し、RESETLOGS オプションを使用してデータベースをオープンする必要がある。', true);
	sortChoice();
	
	// 370
	q_list.push(new Question('Oracle Database11g でサポートされている個別のアーカイブ・ログの保存先ディレクトリの数はいくつですか？',
	''));
	pushChoice('1', false);
	pushChoice('11', false);
	pushChoice('7', false);
	pushChoice('21', false);
	pushChoice('10', true);
	sortChoice();
	
	// 371
	q_list.push(new Question('Recovery Manager (RMAN) で以下のコマンドを実行しました。'
	+ '\n'
	+ '\nRMAN> REPORT NEED BACKUP days 3;'
	+ '\n'
	+ '\nこのコマンドの出力は何ですか?',
	'保存方針を上書きする（または、保存方針が有効でない場合）には、REPORTNEEDBACKUP DAYS を実行します。'
	+ '\nバックアップのリカバリには、DAYS の値で指定された日数分のアーカイブログが必要なため、DAYS パラメータ値よりも古いファイルはすべて新規バックアップが必要です。'));
	pushChoice('3 日以上のアーカイブログの適用が必要なファイルの一覧', true);
	pushChoice('過去 3 日間にバックアップが実行され、大量のトランザクションが実行されたために再度バックアップが必要なファイルの一覧', false);
	pushChoice('3 日以内にバックアップが必要なファイルの一覧', false);
	pushChoice('変動が低いため、RMAN が 3 日ごとのバックアップを推奨するファイルの一覧', false);
	sortChoice();
	
	// 372
	q_list.push(new Question('以下のシナリオを想定して下さい。'
	+ '\n'
	+ '\nターゲット・データベースのインスタンスは稼働中です。'
	+ '\nターゲット・データベースの最新のバックアップは2日前に実行されており、 過去 2 日以内に、ログファイルの切り替えが発生しています。'
	+ '\nターゲット・データベースは、以下の Recovery Manager (RMAN) duplicate コマンドにより、同一ホスト上に複製されます。'
	+ '\n'
	+ '\nRMAN> RUN'
	+ '\n{'
	+ '\nALLOCATE AUXILIARY CHANNEL aux 1 DEVICE TYPE DISK;'
	+ '\nDUPLICATE TARGET DATABASE TO auxdb;'
	+ '\n}'
	+ '\n'
	+ '\nこのシナリオの複製データベースに関する正しい説明は、次のどれですか？',
	'ARCHIVELOGモードのデータベースをバックアップベースで複製する場合、デフォルトでは、RMANによってそのコマンドが実行された時点で最後に作成されたアーカイブREDOログまで、または SET UNTIL句で指定した時点までリカバリされます。'
	+ '\n'
	+ '\n複製時に、ターゲットのオンライン REDO ログはバックアップされておらず、複製データベースに適用できないため、RMAN は不完全リカバリを実行する必要があります。'
	+ '\nRMAN は、ターゲット・データベースによりアーカイブされた最新の REDO ログまで複製データベースをリカバリできます。'));
	pushChoice('現行のオンライン REDO ファイルのトランザクションで使用されているデータを除く、ターゲット・データベースの全データが含まれる。', true);
	pushChoice('ターゲット・データベースの現在までの全データが含まれる。', false);
	pushChoice('ターゲット・データベースのコミットされたトランザクションのデータだけがすべて含まれる。', false);
	pushChoice('最新バックアップまでのデータが含まれる。', false);
	sortChoice();
	
	// 373
	q_list.push(new Question('データベース・リプレイのワークロードの取得中に取得されるクライアント・リクエストは、次のどれですか？ （2 つ選択して下さい）',
	'次のタイプのクライアント・リクエストは、ワークロードに取得されません。'
	+ '\n'
	+ '\n- SQL*Loaderなどのユーティリティを使用する、外部ファイルからのデータのダイレクト・パス・ロード'
	+ '\n- 共有サーバー・リクエスト（Oracle MTS）'
	+ '\n- Oracle Streams'
	+ '\n- アドバンスト・レプリケーション・ストリーム'
	+ '\n- PL/SQL以外のアドバンスト・キューイング(AQ)'
	+ '\n- フラッシュバック問合せ'
	+ '\n- Oracle Call Interface(OCI)ベースのオブジェクト・ナビゲーション'
	+ '\n- SQL以外のオブジェクト・アクセス'
	+ '\n- 分散トランザクション(取得された分散トランザクションはすべてローカル・トランザクションとしてリプレイされます。)'));
	pushChoice('セッションのログイン/ログオフ操作', true);
	pushChoice('フラッシュバック問合せ', false);
	pushChoice('共有サーバー・リクエスト', false);
	pushChoice('データ定義言語（DDL）とデータ操作言語（DML）操作', true);
	pushChoice('SQL*Loaderなどのユーティリティを使用した外部ファイルからのデータのダイレクト・パス・ロード', false);
	sortChoice();
	
	// 374
	q_list.push(new Question('SQL チューニング・アドバイザの API を提供するパッケージは、次のどれですか？',
	'SQL チューニング・アドバイザの推奨インターフェースは、Oracle Enterprise Manager です。'
	+ '\nただし、Oracle Enterprise Manager が利用不可の場合は、DBMS_SQLTUNE パッケージのプロシージャを使用して、SQL チューニング・アドバイザを実行できます。'
	+ '\nDBMS_SQLTUNE パッケージは、次の 3 つの相互に関係する機能を提供しています。'
	+ '\n'
	+ '\n-SQL チューニング・アドバイザ・サブプログラム'
	+ '\n-SQL プロファイル・サブプログラム'
	+ '\n-SQL チューニング・セット・サブプログラム'));
	pushChoice('DBMS_ADVISOR', false);
	pushChoice('DBMS_STATS', false);
	pushChoice('DBMS_MONITOR', false);
	pushChoice('DBMS_SQLTUNE', true);
	sortChoice();
	
	// 375
	q_list.push(new Question('SYSDBA権限を持つ共通ユーザーとしてプラガブルデータベース（PDB）に接続している。'
	+ '\nPDBがオープンの状態で、SHUTDOWN IMMEDIATEコマンドを発行した。'
	+ '\n結果はどうなる？',
	''));
	pushChoice('PDBはクローズする。', false);
	pushChoice('PDBはマウント状態になる。', true);
	pushChoice('共通ユーザーがPDBのSET CONTAINER特権を付与されている場合にのみコマンドが実行される。', false);
	pushChoice('ローカルユーザーだけがPDBをシャットダウンできるため、コマンドがエラーになる。', false);
	sortChoice();
	
	// 376
	q_list.push(new Question('メディアマネージャインタフェースを介してテープへのデータベースバックアップを実行している間、RMANがデータブロックをテープドライブに十分な速度で送信していないため、テープストリーミングが行われていないという問題がある。'
	+ '\nバックアップ中にテープストリーミングを実行するために正しい操作を2つ選択しなさい。',
	''));
	pushChoice('rateパラメータで容量を増やすようにチャネルを設定する', false);
	pushChoice('3LKSIZEオプションを使用してテープバッファサイズを調整するようにチャネルを設定する', true);
	pushChoice('増分バックアップを使用してバックアップポリシーを構成する', false);
	pushChoice('バックアップの最適化を設定する', false);
	pushChoice('large_poolを設定する（まだ行っていない場合）。あるいは、large_poolのサイズを増やす', false);
	pushChoice('maxopenfilesを増やすようにチャネルを設定する', true);
	sortChoice();
	
	// 377
	q_list.push(new Question('Oracle 11gデータベースをマルチテナントコンテナデータベース（CDB）内のプラガブルデータベース（PDB）として移行するとします。'
	+ '\n移行を実行するために必要な手順を調べます。'
	+ '\n'
	+ '\n1. Data Pumpエクスポートを使用して、エクスポートパラメータVERSION = 12を指定して、ソースデータベースで完全に転送可能なエクスポートを実行します。'
	+ '\n2.ソースデータベースで、すべての表領域を読み取り専用モードにします。'
	+ '\n3.ソースデータベースをOracle Database 12cにアップグレードします。'
	+ '\n4.ダンプファイルとデータファイルをターゲットデータベースの適切な場所にコピーします。'
	+ '\n5.ターゲットCDBに新しいPDBを作成します。'
	+ '\n6.ターゲットCDBのPDBを同期します。'
	+ '\n7.フル・トランスポータブル・インポート・オプションを使用して、新しいPDBでData Pump Importを使用します。'
	+ '\n'
	+ '\n必要な手順を正しい順序で識別してください。',
	'この例は、ダンプファイルベースの完全にトランスポータブルなエクスポート/インポート操作です。'
	+ '\nこの場合、ソースデータベースからのメタデータはダンプファイルにエクスポートされ、ダンプファイルとテーブルスペースデータファイルの両方が新しいシステムに転送されます。'
	+ '\n手順は次のとおりです。'
	+ '\n'
	+ '\nソースデータベースのユーザー表領域をREAD ONLYに設定します。'
	+ '\nソースデータベースのインポート先となるPDBを含めて、ターゲットシステム上にCDBを作成します。'
	+ '\nOracle Database 11gリリース2（11.2.0.3）環境から、FULL = YおよびTRANSPORTABLE = ALWAYSパラメータを使用して、ソースデータベースから管理表領域にあるメタデータおよびすべてのデータをエクスポートします。'
	+ '\nVERSION = 12パラメータは、Oracle Database 11gリリース2データベースからエクスポートする場合にのみ必要です。'
	+ '\nソースシステムからターゲットシステムにテーブルスペースデータファイルをコピーします。'
	+ '\nOracle Database 12c環境の場合、作成済みのPDBに接続してダンプファイルをインポートします。'));
	pushChoice('1、5、4、7、6', false);
	pushChoice('3、2、5、1、4、7', false);
	pushChoice('2、5、1、4、7、6', true);
	pushChoice('2、1、3、5、7、6', false);
	sortChoice();
	
	// 378
	q_list.push(new Question('フォーマット済みブロックのみがバックアップされるようにデータベースをバックアップしたいとします。'
	+ '\nこのバックアップ操作について正しい説明はどれですか。',
	''));
	pushChoice('データベースはイメージコピーとしてバックアップする必要があります。', false);
	pushChoice('バックアップはマウント状態で実行する必要があります。', false);
	pushChoice('表領域をオフラインにする必要があります。', false);
	pushChoice('すべてのファイルをバックアップセットとしてバックアップする必要があります。', true);
	sortChoice();
	
	// 379
	q_list.push(new Question('Oracle Data Pumpに関して正しい説明を2つ選んでください。',
	''));
	pushChoice('EXPDPとIMPDPは、Oracle Data Pumpのクライアントコンポーネントです。', true);
	pushChoice('DBMS_DATAPUMP PL / SQLパッケージは、Data Pumpクライアントとは無関係に使用できます。', true);
	pushChoice('Oracle Data Pumpのエクスポートおよびインポート操作は、SYSDBA権限を持つユーザーのみが実行できます。', false);
	pushChoice('Oracle Data Pumpのインポートは、Original Export Utilityで生成されたエクスポートファイルから実行できます。', false);
	pushChoice('EXPDPおよびIMPDPは、エクスポートおよびインポートのコマンドを実行するためにDBMS_METADATAで提供されているプロシージャを使用します。', false);
	sortChoice();
	
	// 380
	q_list.push(new Question('データベースリソースマネージャを使用する目的として正しいものを2つ選択しなさい。',
	''));
	pushChoice('ユーザーに許可される同時セッションの最大数を指定します', false);
	pushChoice('データベースコールごとに使用されるCPUを制限する', false);
	pushChoice('アイドル状態で他のセッションをブロックしているセッションに適用されるアイドル時間制限を指定します。', true);
	pushChoice('ユーザーまたはユーザーグループによって実行される操作の並列度を制限する', true);
	pushChoice('SGAの共有プールにセッションが割り当てることができるプライベートスペースの量を指定します', false);
	sortChoice();
	
	// 381
	q_list.push(new Question('11.2.0.3データベースをOracle 12cデータベースに移行する必要があります。'
	+ '\nこのタスクを実行するために使用される可能性があるステップのリストを調べます。'
	+ '\n'
	+ '\n1.ソースデータベースで、すべてのユーザー定義テーブルスペースを読み取り専用モードにします。'
	+ '\n2.必要に応じて、RMANのconvertコマンドを使用して、データファイルをターゲットプラットフォームのエンディアン形式に変換します。'
	+ '\n3.パラメータVERSI0N = 12、TRANSPORTABLE = ALWAYS、およびFULL = Yを使用して、ソースデータベースで完全に転送可能なエクスポートを実行します。'
	+ '\n4.すべてのユーザー定義表領域のデータファイルを転送します。'
	+ '\n5.エクスポートダンプファイルをターゲットデータベースに転送します。'
	+ '\n6. full、network_link、およびtransportable_datafilesパラメータを使用して、ターゲットデータベースでインポートを実行します。'
	+ '\n7. fullパラメータとtransportable_datafilesパラメータを使用して、ターゲットデータベースでインポートを実行します。'
	+ '\n'
	+ '\n必要な手順を正しい順序で識別してください。'
	+ '\n',
	''));
	pushChoice('2、4、5、6、7', false);
	pushChoice('1、2、4、7', false);
	pushChoice('1、3、5、4、2、7', true);
	pushChoice('1、2、4、6、5、3、7', false);
	sortChoice();
	
	// 382
	q_list.push(new Question('マルチテナントコンテナデータベース（CDB）に複数のプラガブルデータベース（PDB）が含まれています。'
	+ '\nコマンドを実行して共通ユーザーを作成します。'
	+ '\n'
	+ '\nSQL> CREATE USER c ## a_admin IDENTIFIED BY password'
	+ '\n  DEFAULT TABLESPACE users'
	+ '\n  QUOTA 100M ON users'
	+ '\n  TEMPORARY TABLESPACE temp'
	+ '\n '
	+ '\nコマンドについて正しい説明を選択しなさい。',
	''));
	pushChoice('CONTAINER = ALL句がないため、コマンドはエラーになります。', false);
	pushChoice('このコマンドは成功し、USERStablespaceがそのPDBに存在しない場合は、PDBのデフォルトの永続表領域をC ## A_ADMINuserのデフォルトの表領域として設定します。', false);
	pushChoice('すべてのPDBにUSERSおよびTEMPテーブルスペースがある場合にのみコマンドが成功します。', true);
	pushChoice('CDBとすべてのPDBに共通ユーザーが作成され、CDBのユーザーと一時表領域を使用してスキーマオブジェクトを格納します。', false);
	sortChoice();
	
	// 383
	q_list.push(new Question('sys、system、およびscottを除くすべてのデータベースユーザーに対して監査ポリシーを有効にします。次のSQL文を発行します。'
	+ '\n'
	+ '\nSQL> AUDIT POLICY ORA_DATABASE_PARAMETER EXCEPT SYS;'
	+ '\nSQL> AUDIT POLICY ORA_DATABASE_PARAMETER EXCEPT SYSTEM;'
	+ '\nSQL> AUDIT POLICY ORA_DATABASE_PARAMETER EXCEPT SCOTT;',
	''));
	pushChoice('sysとscottを除くすべてのユーザー', false);
	pushChoice('scottを除くすべてのユーザー', true);
	pushChoice('sys、system、およびscottを除くすべてのユーザー', false);
	pushChoice('sysを除くすべてのユーザー', false);
	sortChoice();
	
	// 384
	q_list.push(new Question('RMANコマンドを発行します。'
	+ '\n'
	+ '\nRMAN> CONFIGURE DEFAULT DEVICE TYPE TO DISK;'
	+ '\nRMAN> CONFIGURE DEVICE TYPE DISK BACKUP TYPE TO COPY;'
	+ '\nRMAN> CONFIGURE CONTROLFILE AUTOBACKUP ON;'
	+ '\nRMAN> BACKUP DATABASE PLUS ARCHIVELOG DELETE INPUT;'
	+ '\n'
	+ '\nBACKUP DATABASEコマンドで実行されるタスクとして正しいものを3つ選択しなさい。',
	''));
	pushChoice('データファイル内の使用済みブロックと未使用ブロックをすべてバックアップします。', true);
	pushChoice('データファイルの使用済みブロックだけをバックアップします。', false);
	pushChoice('すべてのアーカイブログファイルをバックアップし、それらを古いものとしてマークします。', false);
	pushChoice('オンラインREDOログファイルの切り替え', true);
	pushChoice('すべてのデータファイルをイメージコピーおよびアーカイブログファイルとしてバックアップし、それらのアーカイブログファイルを削除します', true);
	sortChoice();
	
	// 385
	q_list.push(new Question('自動診断リポジトリ（ADR）について正しい説明を2つ選択してください。',
	''));
	pushChoice('ADRを使用してstatspackスナップショットを保存し、データベースのパフォーマンスの問題を診断できます。', false);
	pushChoice('ADRベースはすべての診断情報をバイナリ形式で保持します。', false);
	pushChoice('ADRベースは複数のインスタンス間で共有されます。', true);
	pushChoice('ADRは自動ワークロードリポジトリ（AWR）スナップショットを保存するために使用されます。', false);
	pushChoice('データベースインスタンスが停止している場合でも、ADRを問題診断に使用できます。', true);
	sortChoice();
	
	// 386
	q_list.push(new Question('データベースはアーカイブログモードで実行されており、毎晩定期的にバックアップがとられています。'
	+ '\nメディア障害のため、1つのメンバーを持つカレントのオンラインREDOロググループは失われ、インスタンスは停止しました。'
	+ '\nオンラインREDOロググループをリカバリして新しい場所に移動する手順を調べます。'
	+ '\n'
	+ '\n1.破損したREDOロググループを復元します。'
	+ '\n2.最新のデータベースバックアップからデータベースを復元します。'
	+ '\n3.不完全リカバリを実行します。'
	+ '\n4.破損したオンラインREDOロググループのメンバーを新しい場所に移動します。'
	+ '\n5.RESETLOGSオプションを指定してデータベースを開きます。'
	+ '\n6.チェックポイントを発行してログを消去します。'
	+ '\n'
	+ '\n必要な手順を説明した選択肢を選びなさい。',
	''));
	pushChoice('2、3、4、5', true);
	pushChoice('6、3、4、5', false);
	pushChoice('1、3、4、5', false);
	pushChoice('6、4、3、5', false);
	sortChoice();
	
	// 387
	q_list.push(new Question('リカバリ・カタログとターゲット・データベースに接続しています。'
	+ '\nあなたは次のコマンドを実行しました。'
	+ '\n'
	+ '\nRMAN> CATALOG START WITH "/ disk1 / backups";'
	+ '\n'
	+ '\n正しい説明を選択しなさい。',
	'データファイルのコピー、バックアップピース、またはアーカイブログがディスクにある場合は、CATALOGコマンドを使用してそれらをリカバリカタログにカタログできます。'
	+ '\n次のコマンドは、/ disk1 / backupsがこれらすべてのディレクトリのパスのプレフィックスであるため、これらすべてのディレクトリ内のすべてのファイルをカタログします。'));
	pushChoice('/ disk1 / backupsディレクトリに存在する有効なデータファイルのコピーのみがカタログされます。', false);
	pushChoice('/ disk1 / backupsディレクトリにある有効なバックアップピースとアーカイブログのみがカタログされます。', false);
	pushChoice('/ disk1 / backupsディレクトリおよびそのサブディレクトリのリカバリカタログにカタログされているすべてのデータファイルのコピー、バックアップピース、および達成されたログを一覧表示します。', false);
	pushChoice('すべてのディレクトリパスに存在するすべての有効なデータファイルのコピー、バックアップファイル、およびアーカイブログを、プレフィックス/ disk1 / backupsとそのサブディレクトリを使用して一覧表示してカタログ化します。', true);
	sortChoice();
	
	// 388
	q_list.push(new Question('データベースはARCHIVELOGモードで実行されています。データベースインスタンスに設定する予定の初期化パラメータを調べます。'
	+ '\n'
	+ '\nLOG_ARCHIVE_DEST_1 = "LOCATION = / disk1 / arch"'
	+ '\nLOG_ARCHIVE_DEST_2 = "L0CATI0N = / disk2 / arch"'
	+ '\nLOG_ARCHIVE_DEST_3 = "LOCATION = / disk3 / arch"'
	+ '\nL0G_ARCHIVE_DEST_4 = "L0CATI0N = / disk4 / arch mndatory"'
	+ '\n'
	+ '\nこの結果に対して正しい説明を選択しなさい。',
	''));
	pushChoice('これらの設定は、LOG__ARCHIVE_MIN_SUCCEED_DESTが4の値に設定されている場合にのみ機能します。', false);
	pushChoice('オプションのバックアップ先は高速リカバリ領域を使用できません。', false);
	pushChoice('LOG_ARCHIVE_DEST_4に指定された場所にアーカイブ・ログ・ファイルを作成できない場合、オンラインREDOログ・ファイルは上書きできません。', true);
	pushChoice('LOG_ARCHIVE_DEST_1-4のいずれかにアーカイブ・ログ・ファイルを作成できない場合、オンラインREDOログ・ファイルは上書きできません。', false);
	sortChoice();
	
	// 389
	q_list.push(new Question('ホスト上で稼働している本番用のOracle 12cデータベースがあります。'
	+ '\nOracleデータベースソフトウェアがインストールされていない複数の新しいマシンにデータベースをインストールして作成するとします。'
	+ '\nまた、新しいデータベースも既存の12cデータベースと同じディレクトリ構造とコンポーネントを持つようにします。'
	+ '\n'
	+ '\n1.すべての新しいマシンに、運用データベースと同様のディレクトリ構造を作成します。'
	+ '\n2.本番データベースと同じ構成でOracle Universal Installer（OUI）用のレスポンスファイルを作成します。'
	+ '\n3.データベース用のデータベースクローンテンプレートを作成します。'
	+ '\n4. Database Configuration Assistant（DBCA）を実行してデータベースを作成します。'
	+ '\n5.各マシンでOUIをグラフィカルモードで実行します。'
	+ '\n6. OUIレスポンスファイルを使用して、サイレントモードでOUIを実行します。'
	+ '\n'
	+ '\n最も簡単にインストールを行う手順として正しいものを選択しなさい。',
	''));
	pushChoice('1、5、4', false);
	pushChoice('3、1、5、6', false);
	pushChoice('2、3、1、6', true);
	pushChoice('2、3、6', false);
	pushChoice('2、1、6、4', false);
	sortChoice();
	
	// 390
	q_list.push(new Question('ARCHIVELOGモードのデータベースでRMANを使用してバックアップできるものとして正しい選択肢を2つ選択しなさい。',
	''));
	pushChoice('データベースがオープン状態のときのデータファイル', true);
	pushChoice('データベースがNOMOUNT状態のときのデータファイル', false);
	pushChoice('前回のバックアップ以降に変更されたデータファイル内のデータブロック', true);
	pushChoice('データベースがオープン状態のときのオンラインREDOログファイル', false);
	pushChoice('データベースがMOUNT状態のときのPFILEとパスワードファイル', false);
	sortChoice();
	
	// 391
	q_list.push(new Question('Recovery Manager（RMAN）でリカバリカタログを使用する理由として正しいものを3つ選択しなさい。',
	''));
	pushChoice('指定した期間が経過した後に古いバックアップを自動的に削除します', false);
	pushChoice('複数のデータベースのバックアップ情報を一箇所に保存します', true);
	pushChoice('バックアップで使用される容量を制限します', false);
	pushChoice('リカバリカタログに登録されているターゲットデータベースに接続できるすべてのRMANクライアントが利用できるRMANスクリプトを格納します。', true);
	pushChoice('KEEP FOREVER句を使用してバックアップを無期限に維持します', true);
	sortChoice();
	
	// 392
	q_list.push(new Question('データベースは、複雑なクエリの実行を伴う意思決定支援システム（DSS）ワークロードをサポートしています。'
	+ '\n現在、データベースはピークワークロードで稼働しています。'
	+ '\nライブラリキャッシュにキャッシュされている、最もリソースを消費するステートメントのいくつかを分析したいとします。'
	+ '\nクエリのパフォーマンスを向上させるためにインデックスとマテリアライズドビューを効率的に使用するための推奨事項を受け取るには、何を実行する必要がありますか？',
	''));
	pushChoice('SQLパフォーマンスアナライザ', false);
	pushChoice('SQLアクセスアドバイザ', true);
	pushChoice('SQLチューニングアドバイザ', false);
	pushChoice('自動ワークロードリポジトリ（AWR）レポート', false);
	pushChoice('自動データベース診断モニター（ADDM）', false);
	sortChoice();
	
	// 393
	q_list.push(new Question('データベースはnoarchivelogモードで実行されています。'
	+ '\nシステム表領域に属するデータファイルの1つが破損しています。'
	+ '\n最後のバックアップ以降、オンラインREDOログはすべて上書きされています。'
	+ '\nデータファイルを回復するためにどの方法を使用しますか？',
	''));
	pushChoice('まだシャットダウンされていない場合はインスタンスをシャットダウンし、最後のバックアップからシステム表領域に属する破損したデータファイルを復元し、インスタンスを再起動します。', false);
	pushChoice('まだシャットダウンしていない場合はインスタンスをシャットダウンし、最後のバックアップからデータベース全体のすべてのデータファイルを復元して、インスタンスを再起動します。', true);
	pushChoice('データベースをマウントし、最後のバックアップからシステムテーブルスペースに属するすべてのデータファイルを復元し、データベースを開きます。', false);
	pushChoice('まだ停止していない場合はインスタンスを停止し、最後のバックアップからシステム表領域に属するすべてのデータファイルを復元して、インスタンスを再起動します。', false);
	sortChoice();
	
	// 394
	q_list.push(new Question('RMANコマンドを調べます。'
	+ '\n'
	+ '\nRMAN> RUN {'
	+ '\n    ALLOCATE CHANNEL c1 DEVICE TYPE SBT;'
	+ '\n    ALLOCATE CHANNEL c2 DEVICE TYPE SBT;'
	+ '\n    ALLOCATE CHANNEL c3 DEVICE TYPE SBT;'
	+ '\n    BACKUP'
	+ '\n    INCREMENTAL LEVEL = 0'
	+ '\n  (DATAFILE 1,4,5 CHANNEL c1)'
	+ '\n  (DATAFILE 2,3,9 CHANNEL c2)'
	+ '\n  (DATAFILE 6,7,8 CHANNEL c3);'
	+ '\n  SQL "ALTER SYSTEM ARCHIVE LOG CURRENT";'
	+ '\n}'
	+ '\n'
	+ '\nコマンドについて正しい説明を選択しなさい。',
	''));
	pushChoice('圧縮バックアップセットを作成します。', false);
	pushChoice('バックアップに非同期I / Oを使用します。', false);
	pushChoice('バックアップセットに並列化を使用します。', true);
	pushChoice('マルチセクションバックアップを使用します。', false);
	sortChoice();
	
	// 395
	q_list.push(new Question('電気通信会社は、電話の時間の順にリストされた顧客の電話の詳細を含む毎月の請求書を生成したいと考えています。'
	+ '\nどのテーブル構成が、最も少ないコストで請求書を生成できますか。',
	''));
	pushChoice('ROWID列を持つヒープテーブル', false);
	pushChoice('ハッシュクラスタ', false);
	pushChoice('パーティションテーブル', false);
	pushChoice('インデックスクラスタ', false);
	pushChoice('ソートされたハッシュクラスタ', true);
	sortChoice();
	
	// 396
	q_list.push(new Question('本番データベースはarchivelogモードで稼働しています。'
	+ '\nデータベースをメディアにバックアップするには、リカバリ・カタログとともにRMANを使用します。'
	+ '\nデータベースはリカバリ・カタログ内で一意に識別されます。'
	+ '\n本番データベースからテストデータベースを作成し、複製プロセス中も本番データベースを開いたままにします。'
	+ '\n本番データベースと同じディレクトリ構造を持つ新しいホストにデータベースのバックアップを復元し、データベースが新しいホストに正常に復元された後の将来のバックアップにリカバリカタログを使用するとします。'
	+ '\nどのようにこれを達成しますか？',
	''));
	pushChoice('RMAN SWITCHコマンドを使用してデータファイルの新しい場所を設定します。', false);
	pushChoice('DBIDを指定したRMAN DUPLICATEコマンドとSET NEWNAME FOR TABLESPACEを使用してデータベースを新しいホストにリカバリします。', false);
	pushChoice('新しいホストに新しいデータベースを作成し、次にRMAN RECOVERコマンドを使用します。', false);
	pushChoice('NOFILENAMECHECKを指定したRMAN DUPLICATEコマンドを使用してデータベースを新しいホストにリカバリします。', true);
	sortChoice();
	
	// 397
	q_list.push(new Question('UNIXベースのOracle 12cデータベースでマルチスレッドを有効にするには、Oracleの所有者としてSQL * Plusでコマンドを発行します。'
	+ '\n'
	+ '\nCONNECT / AS SYSDBA'
	+ '\nALTER SYSTEM SET THREADED_EXECUTION = TRUE SCOPE = SPFILE;'
	+ '\nSHUTDOWN;'
	+ '\n'
	+ '\nその後、インスタンスを再起動するとエラーが発生します。'
	+ '\n'
	+ '\nSTARTUP;'
	+ '\nORA-01031：権限が不十分です。'
	+ '\n'
	+ '\n起動コマンドが表示されるエラーを返すのはなぜですか？',
	''));
	pushChoice('スレッドアーキテクチャでは、起動コマンドを発行する前にリスナーを介してインスタンスに接続する必要があるため', false);
	pushChoice('スレッド化アーキテクチャでは、起動コマンドを発行する前に、sql * plusからsysdbaとして新しいconnect /を発行する必要があるため', false);
	pushChoice('スレッド化アーキテクチャでは、起動コマンドを発行する前に、sql * plusを終了し、sysdbaとしてsql * Plus /に再接続する必要があるため', false);
	pushChoice('スレッド化アーキテクチャでは、起動コマンドを発行する前にパスワードファイルを使用した認証が必要なため', true);
	pushChoice('スレッド化アーキテクチャでは起動コマンドを発行する前にリスナーを再起動する必要があるため', false);
	sortChoice();
	
	// 398
	q_list.push(new Question('LDAP_DIRECTORY_SYSAUTHがYESに設定されています。'
	+ '\nDBAアクセスを必要とするユーザーには、Oracle Internet Directory（OID）におけるsysdbaエンタープライズロールが付与されています。'
	+ '\nデータベースとOIDにSSLが設定され、データベースにパスワードファイルが設定されています。'
	+ '\nsysdba特権を持つユーザーscottは、次のコマンドを使用してリモート接続を試みます。'
	+ '\n$ sqlplus scott / tiger @ DB01 sysdbaとして、DB01はネットサービス名です。'
	+ '\nどの認証方法が最初に試行されますか？',
	''));
	pushChoice('パスワードファイルによる認証', false);
	pushChoice('SSLを介した証明書による認証', false);
	pushChoice('Oracle Internet Directoryを使用した認証', false);
	pushChoice('データベースサーバのローカルOSを使用した認証', false);
	sortChoice();
	
	// 399
	q_list.push(new Question('デフォルトのフラッシュバック・データ・アーカイブFLA1を作成し、それをHRスキーマのEMPLOYEES表に対して使用可能にします。'
	+ '\n数日後、次のコマンドを実行してEMPLOYEESテーブルを変更します。'
	+ '\n'
	+ '\nSQL> ALTER TABLE EMPLOYEES ADD phone NUMBER（12);'
	+ '\n'
	+ '\nコマンドについて正しい説明を選択しなさい。',
	''));
	pushChoice('正常に実行され、EMPLOYEESテーブルに関連したメタデータの格納が続行されます。', true);
	pushChoice('正常に実行されましたが、EMPLOYEES表のフラッシュバック・データ・アーカイブは無効です。', false);
	pushChoice('正常に実行され、表定義を変更する前にEMPLOYEES表に関連するすべてのメタデータがFlashback Data Archiveから削除されます。', false);
	pushChoice('フラッシュバック・データ・アーカイブが有効になっている表に対してDDL文を実行できないため、エラーが発生します。', false);
	sortChoice();
	
	// 400
	q_list.push(new Question('データベースでは、毎日、レベル1の増分バックアップが取られます。'
	+ '\n火曜日のバックアップ実行前に、新しい表領域を追加した後、下のコマンドを実行しました。'
	+ '\n'
	+ '\nRMAN> BACKUP INCREMENTAL LEVEL 1 FOR RECOVER OF COPY TAG WEEKLY;'
	+ '\n'
	+ '\nコマンドについて正しい説明を選択しなさい。',
	''));
	pushChoice('新しいデータファイルに使用できるレベル0のバックアップがないため、エラーを返します。', false);
	pushChoice('新しいデータファイルのイメージコピーバックアップ、および他のすべてのデータファイルのレベル1の増分バックアップを実行します。', true);
	pushChoice('新しい表領域に属するものも含め、すべてのデータファイルのレベル0バックアップを実行します。', false);
	pushChoice('新しい表領域に属するものも含め、すべてのデータファイルのイメージコピーバックアップを実行します。', false);
	pushChoice('新しい表領域に属するものも含め、すべてのデータファイルのバックアップセットとしてバックアップを実行します。', false);
	sortChoice();
	
	// 401
}());

(function(){
    sortQuestion();
	console.log(q_list);	
}());
