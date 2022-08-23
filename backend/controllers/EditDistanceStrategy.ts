import { StringMatchingStrategy } from "./interfaces/StringMatchingStrategy";


export class EditDistanceStrategy implements StringMatchingStrategy {
  public editDistance(x: string, y: string){ // edit distance of transforming x to y
    // Initialization of DP Array
    let dp = new Array(2);
    for (let i = 0; i < dp.length; i++) dp[i] = new Array(y.length+1)
    for (let i = 0; i < 2; i++) for (let j = 0; j < dp[i].length; j++) dp[i][j] = 0
    
    // Calculating using Dynamic Programming
    let ret1 = 0;
    for (let i = 0; i <= x.length; ++i) {
        ret1 ^= 1;
        for (let j = 0; j <= y.length; ++j) {
            if (i == 0 || j == 0) dp[ret1][j] = Math.max(i, j);
            else if (x[i - 1] == y[j - 1]) dp[ret1][j] = dp[ret1^1][j-1];
            else dp[ret1][j] = Math.min(dp[ret1][j-1], dp[ret1^1][j], dp[ret1^1][j-1]) + 1;
        }
    }
    return dp[ret1][y.length];
  }

  public getPercentageSimilarities(str1: string, str2: string){
    let x,y;    
    if(str1 == null || str2 == null){
      return 0;
    }else{
      if(str1?.length >= str2?.length) x = str1, y = str2;
      else x = str2, y = str1;
    }
    return (Math.abs(x.length - this.editDistance(x, y))) / parseFloat(x.length);
  }
}