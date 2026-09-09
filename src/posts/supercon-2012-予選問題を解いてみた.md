---
title: "Supercon2012予選問題を解いてみた"
date: 2012-06-24T17:58:00+09:00
slug: "supercon-2012-予選問題を解いてみた"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "supercon2012"
    label: "Supercon2012"
---
---

以前から、[Supercon](http://www.gsic.titech.ac.jp/supercon/main/attwiki/)の存在自体は知っていて、ずっと参加したいと思っていたのですが、ついに参加する機会を得ることが出来たので予選問題解きました。
**が**、まさかの応募する際の添付ファイルミスという目も当てられないミスを……
もしこれで本選通っていたら奇跡ですね。

追記(2012/6/25):詳細の説明は私事により2週間ほど先になるかも……？
コードが長いのは仕様です。期限日の午前4時に書いていたらこうなります。
動的計画法とかそんな時間短縮を使う暇も知識もなかったのですし…
全てが同じ文字のパターンに対しては一応関数を作って対処してます。
ただ、|W|が短い場合の対策がほぼ皆無。
添付ファイルミスとは: 寝ぼけて**< **と**< =**を間違えたプログラムを送信した。

というわけでとりあえず修正したソースだけ置いておきます。~~詳細は後ほど?
~~**多分書かない。というか書けない…… (2012.7.8追記)**

```

/* SuperCon 2012 予選問題C用テンプレート(問C,スーパーコン予選問題 兼 1級認定問題 2012版)
・解答プログラムはこのテンプレートに従って作成すること.
・解答プログラムは1つのファイルで,チーム名.c という名前にすること.
・入力の方式は,あらかじめ入力ファイル(例:input_sample.txt)を作っ
ておき,実行時にファイル名を指定する方式です.
*/

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>

/* ↓以下の範囲は変更可能 */
#define TIME_LIMIT 59.5
#define MAX_LEN 10
#define MAX_V 100000

#define max(a,b) ( a > b ? a : b )
#define min(a,b) ( a > b ? b : a )

int isFront(char input[]);

void searchTree(int flag, int answerTemp, char inputStr[]);

void searchB (void);

int isTypeB(void);

int Sum(int flag);

int N_G = 0;
int v_G[1000];
char w_G[1000][10 + 1];
char W_G[10000 + 1];
clock_t start_G;

int answerTemp_G = 0,strLenTemp_G = 0;
/* ↑上記の範囲は変更可能 */

int main(int argc, char** argv){
int answer = -1; /* この変数に答(Vの最大値)を代入してください */
int N;
static int v[1000];
static char w[1000][10+1];
static char W[10000+1];
char* problem_file;
clock_t start, end;
FILE* fp;

int i;
char buf[0xffff];
char* p;

if(argc <= 1){
fprintf(stderr, "Enter the input file.¥n");
exit(EXIT_FAILURE);
}

problem_file = argv[1];
fp = fopen(problem_file, "r");
if(fp == NULL){
fprintf(stderr, "Cannot open %s.¥n", problem_file);
exit(EXIT_FAILURE);
}

p = fgets(buf, 0xffff, fp);
assert(p != 0);

N = atoi(strtok(buf, " ¥n"));
assert(1 <= N && N <= 1000);

p = fgets(buf, 0xffff, fp);
assert(p != 0);
p = strtok(buf, " ¥n");
strcpy(W, p);
assert(1 <= strlen(W) && strlen(W) <= 10000);
for(p = W; *p; ++p){
assert(islower(*p));
}

for(i = 0; i < N; ++i){
p = fgets(buf, 0xffff, fp);
assert(p != 0);
v[i] = atoi(strtok(buf, " "));
assert(-1000000 <= v[i] && v[i] <= 1000000);
p = strtok(NULL, " ¥n");
strcpy(w[i], p);
assert(1 <= strlen(w[i]) && strlen(w[i]) <= 10);
for(p = w[i]; *p; ++p){
assert(islower(*p));
}
}

fclose(fp);

start = clock();

/* ↓以下の範囲は変更可能 */

N_G = N;
strcpy(W_G, W);
for (i = 0; i < N; i++) {
memcpy(w_G[i], w[i], sizeof(w[i]));
v_G[i] = v[i];
}
start_G = start;

if (isTypeB() == 0) {
searchB();
} else {
searchTree(0, 0, "");
}

answer = max(0, answerTemp_G);

/* ↑上記の範囲は変更可能 */

end = clock();
printf("%s, %f, %d¥n", problem_file, (double)(end - start) / CLOCKS_PER_SEC, answer);

printf("%s, %d¥n", problem_file, answer);
return 0;
}

/* ↓以下の範囲は変更可能 */

int isFront(char input[]) {

int ret = strncmp(input, W_G, strlen(input));

if (ret == 0) return 0;
if (ret < 0) return 1;

return -1;
}
void searchTree(int flag, int answerTemp, char inputStr[]) {
int quit = 0, len, i;

char *tempStr;
tempStr = (char *)calloc(10000 + 1, sizeof(char));
strcpy(tempStr, inputStr);
len = strlen(tempStr);

for (i = flag; i < N_G; i++) {

if(((double)(clock() - start_G) / CLOCKS_PER_SEC) >= TIME_LIMIT) {
answerTemp_G = max(answerTemp_G,answerTemp); break;
}
memset(tempStr + len, 0, sizeof(char) * (10001 - len));

strcat(tempStr, w_G[i]);

switch (isFront(tempStr)) {
case -1: continue;
case 0:
answerTemp += v_G[i];

answerTemp_G = max(answerTemp, answerTemp_G);

flag = i + 1;
searchTree(flag, answerTemp, tempStr);
answerTemp -= v_G[i];

if (quit == 1) continue;
break;
case 1:
answerTemp += v_G[i];
flag = i;

answerTemp_G = max(answerTemp_G,Sum(flag + 1) + answerTemp);

quit = 1;
continue;
}
}
RET:
free(tempStr);
tempStr = NULL;
return;
}

void searchB (void) {
int AnsS = Sum(0), AnsL = AnsS, WLen = strlen(W_G);
int strLenS = strLenTemp_G, strLenL = strLenTemp_G;
int a = 0, b = MAX_LEN, c, d = MAX_V, e = MAX_V;

if (strLenTemp_G <= WLen) { answerTemp_G = Sum(0); } else {
int i;
while (strLenS > WLen && strLenL > WLen) {

for (i = 0; i < N_G; i++) {
if (v_G[i] > 0) {
c = strlen(w_G[i]);
a = max(a, c);
b = min(b, c);
}
}

for (i = 0; i < N_G; i++) {
if (v_G[i] > 0) {
c = strlen(w_G[i]);
if (a == c) d = min(v_G[i], d);
if (b == c) e = min(v_G[i], e);
}
}

strLenL -= a; AnsL -= d;
strLenS -= b; AnsS -= e;

}
if (strLenL <= WLen) answerTemp_G = AnsL;
if (strLenS <= WLen) answerTemp_G = max(answerTemp_G, AnsS);
}
return;
}

int isTypeB(void) {
char isSame = w_G[0][0];
int i,j = 0;

do {
for (i = 0; i < strlen(w_G[j]) ; i++) if (w_G[j][i] != isSame) { return 1; }
} while ( ++j < N_G );

return 0;
}

int Sum(int flag) {
int i, ret = 0;
for (i = flag; i <= N_G; i++) if(v_G[i] > 0) {
ret += v_G[i];
strLenTemp_G += strlen(w_G[i]);
}

return ret;
}
/* ↑上記の範囲は変更可能 */

```

まさか初投稿がこんな残念な記事になるとは…
